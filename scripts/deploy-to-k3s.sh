#!/bin/bash

###############################################################################
# Deploy to K3s
#
# Faz deploy de todos os services para K3s cluster
#
# Uso:
#   ./scripts/deploy-to-k3s.sh
#
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CLUSTER_NAME="liquidlab-cluster-nemoclaw"

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  DEPLOYING TO K3S — ${CLUSTER_NAME}${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

###############################################################################
# 1. VERIFICAR CLUSTER
###############################################################################

echo -e "${YELLOW}1️⃣  Verificando cluster K3s${NC}"
echo ""

if ! docker ps | grep -q $CLUSTER_NAME; then
    echo -e "${RED}✗ Cluster ${CLUSTER_NAME} não está rodando${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Cluster encontrado${NC}"
echo ""

###############################################################################
# 2. LOAD IMAGES
###############################################################################

echo -e "${YELLOW}2️⃣  Carregando Docker images no K3s${NC}"
echo ""

IMAGES=(
    "liquid-lab-claude-api:latest"
    "liquid-lab-hermes-agent:latest"
    "liquid-lab-embeddings:latest"
    "liquid-lab-liquid-lab-api:latest"
)

for image in "${IMAGES[@]}"; do
    if docker image inspect $image &> /dev/null; then
        echo -e "${BLUE}Loading $image...${NC}"
        docker save $image | docker exec -i $CLUSTER_NAME ctr -n k8s.io images import - &> /dev/null
        echo -e "${GREEN}✓ $image${NC}"
    else
        echo -e "${YELLOW}⚠️  Image $image não encontrada${NC}"
    fi
done

echo ""

###############################################################################
# 3. COPY MANIFESTS
###############################################################################

echo -e "${YELLOW}3️⃣  Copiando Kubernetes manifests${NC}"
echo ""

docker cp k8s/secrets liquidlab-cluster-nemoclaw:/tmp/k8s/ 2>/dev/null || true
docker cp k8s/data-layer liquidlab-cluster-nemoclaw:/tmp/k8s/ 2>/dev/null || true
docker cp k8s/liquid-lab liquidlab-cluster-nemoclaw:/tmp/k8s/ 2>/dev/null || true
docker cp k8s/network-policies liquidlab-cluster-nemoclaw:/tmp/k8s/ 2>/dev/null || true

echo -e "${GREEN}✓ Manifests copiados${NC}"
echo ""

###############################################################################
# 4. DEPLOY
###############################################################################

echo -e "${YELLOW}4️⃣  Deployando services${NC}"
echo ""

# Secrets
echo -e "${BLUE}Applying secrets...${NC}"
docker exec $CLUSTER_NAME kubectl apply -f /tmp/k8s/secrets/01-secrets.yaml &> /dev/null
echo -e "${GREEN}✓ Secrets${NC}"

# Data Layer
echo -e "${BLUE}Applying data-layer...${NC}"
docker exec $CLUSTER_NAME kubectl apply -f /tmp/k8s/data-layer/ &> /dev/null
echo -e "${GREEN}✓ PostgreSQL + Redis${NC}"

# Liquid Lab
echo -e "${BLUE}Applying liquid-lab services...${NC}"
docker exec $CLUSTER_NAME kubectl apply -f /tmp/k8s/liquid-lab/ &> /dev/null
echo -e "${GREEN}✓ API, Agent, Embeddings${NC}"

# Network Policies
echo -e "${BLUE}Applying network policies...${NC}"
docker exec $CLUSTER_NAME kubectl apply -f /tmp/k8s/network-policies/ &> /dev/null
echo -e "${GREEN}✓ Security policies${NC}"

echo ""

###############################################################################
# 5. WAIT FOR PODS
###############################################################################

echo -e "${YELLOW}5️⃣  Aguardando pods iniciarem...${NC}"
echo ""

echo -e "${BLUE}Waiting for pods (max 60s)...${NC}"

for i in {1..60}; do
    READY=$(docker exec $CLUSTER_NAME kubectl get pods -n liquid-lab --no-headers 2>/dev/null | awk '{print $2}' | grep -c "1/1" || echo "0")

    if [ "$READY" -eq "4" ]; then
        echo -e "${GREEN}✓ All pods ready${NC}"
        break
    fi

    echo -ne "\r  [$i/60] Pods ready: $READY/4"
    sleep 1
done

echo ""
echo ""

###############################################################################
# 6. STATUS
###############################################################################

echo -e "${YELLOW}6️⃣  Status final${NC}"
echo ""

echo -e "${BLUE}Liquid Lab namespace:${NC}"
docker exec $CLUSTER_NAME kubectl get pods -n liquid-lab --no-headers 2>/dev/null || echo "No pods"

echo ""
echo -e "${BLUE}Data Layer namespace:${NC}"
docker exec $CLUSTER_NAME kubectl get pods -n data-layer --no-headers 2>/dev/null || echo "No pods"

echo ""

###############################################################################
# 7. SUMMARY
###############################################################################

echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ DEPLOYMENT COMPLETE${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Services available:${NC}"
echo ""
echo "  API:           http://localhost:3000"
echo "  Grafana:       http://localhost:3100"
echo "  Prometheus:    http://localhost:9090"
echo ""
echo -e "${BLUE}Comandos úteis:${NC}"
echo ""
echo "  Ver logs:       docker exec $CLUSTER_NAME kubectl logs -f -n liquid-lab <pod>"
echo "  Conectar pod:   docker exec $CLUSTER_NAME kubectl exec -it -n liquid-lab <pod> sh"
echo "  Port-forward:   docker exec $CLUSTER_NAME kubectl port-forward -n liquid-lab svc/<service> <port>:<port>"
echo ""
