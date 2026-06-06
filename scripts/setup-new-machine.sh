#!/bin/bash

###############################################################################
# Liquid Lab Setup Script
#
# Este script configura um novo ambiente Liquid Lab (K3s + services)
# em uma máquina nova em ~5 minutos.
#
# Pré-requisitos:
#   - Docker Desktop (rodando)
#   - Node.js 18+
#   - Git
#   - ~8GB RAM disponível
#   - ~20GB disco
#
# Uso:
#   ./scripts/setup-new-machine.sh
#
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  LIQUID LAB SETUP — Novo Ambiente${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

###############################################################################
# 1. PRÉ-REQUISITOS
###############################################################################

echo -e "${YELLOW}1️⃣  Verificando pré-requisitos...${NC}"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker não encontrado. Instale Docker Desktop.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker${NC} $(docker --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js não encontrado. Instale Node.js 18+.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js${NC} $(node --version)"

# Check Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git não encontrado.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git${NC} $(git --version | head -1)"

# Check Docker daemon
if ! docker ps &> /dev/null; then
    echo -e "${RED}✗ Docker daemon não está rodando. Inicie Docker Desktop.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker daemon${NC} rodando"

echo ""

###############################################################################
# 2. ENVIRONMENT
###############################################################################

echo -e "${YELLOW}2️⃣  Configurando environment...${NC}"
echo ""

if [ ! -f .env.local ]; then
    echo -e "${BLUE}Criando .env.local${NC}"
    cp .env.example .env.local

    # Generate random DB password
    DB_PASSWORD=$(openssl rand -base64 12)
    sed -i '' "s/dev-only-change-in-prod/$DB_PASSWORD/" .env.local

    echo -e "${GREEN}✓ .env.local criado${NC}"
    echo "  DB_PASSWORD: $(echo $DB_PASSWORD | cut -c1-8)..."
else
    echo -e "${YELLOW}ℹ️  .env.local já existe${NC}"
fi

echo ""

###############################################################################
# 3. DEPENDÊNCIAS
###############################################################################

echo -e "${YELLOW}3️⃣  Instalando dependências${NC}"
echo ""

# Hermes Agent
if [ ! -d "services/hermes-agent/node_modules" ]; then
    echo -e "${BLUE}Installing hermes-agent dependencies...${NC}"
    cd services/hermes-agent
    npm install --silent
    cd ../..
    echo -e "${GREEN}✓ hermes-agent${NC}"
else
    echo -e "${YELLOW}ℹ️  hermes-agent dependencies já instaladas${NC}"
fi

# Embeddings
if [ ! -d "services/embeddings/node_modules" ]; then
    echo -e "${BLUE}Installing embeddings dependencies...${NC}"
    cd services/embeddings
    npm install --silent
    cd ../..
    echo -e "${GREEN}✓ embeddings${NC}"
else
    echo -e "${YELLOW}ℹ️  embeddings dependencies já instaladas${NC}"
fi

# Claude API
if [ ! -d "services/claude-api/node_modules" ]; then
    echo -e "${BLUE}Installing claude-api dependencies...${NC}"
    cd services/claude-api
    npm install --silent
    cd ../..
    echo -e "${GREEN}✓ claude-api${NC}"
else
    echo -e "${YELLOW}ℹ️  claude-api dependencies já instaladas${NC}"
fi

# Liquid Lab API
if [ ! -d "code/node_modules" ]; then
    echo -e "${BLUE}Installing liquid-lab-api dependencies...${NC}"
    cd code
    npm install --silent
    cd ..
    echo -e "${GREEN}✓ liquid-lab-api${NC}"
else
    echo -e "${YELLOW}ℹ️  liquid-lab-api dependencies já instaladas${NC}"
fi

echo ""

###############################################################################
# 4. DOCKER IMAGES
###############################################################################

echo -e "${YELLOW}4️⃣  Construindo Docker images${NC}"
echo ""

# Claude API
if ! docker image inspect liquid-lab-claude-api:latest &> /dev/null; then
    echo -e "${BLUE}Building claude-api...${NC}"
    docker build -t liquid-lab-claude-api:latest ./services/claude-api --quiet
    echo -e "${GREEN}✓ claude-api${NC}"
else
    echo -e "${YELLOW}ℹ️  claude-api image já existe${NC}"
fi

# Hermes Agent
if ! docker image inspect liquid-lab-hermes-agent:latest &> /dev/null; then
    echo -e "${BLUE}Building hermes-agent...${NC}"
    docker build -t liquid-lab-hermes-agent:latest ./services/hermes-agent --quiet
    echo -e "${GREEN}✓ hermes-agent${NC}"
else
    echo -e "${YELLOW}ℹ️  hermes-agent image já existe${NC}"
fi

# Embeddings
if ! docker image inspect liquid-lab-embeddings:latest &> /dev/null; then
    echo -e "${BLUE}Building embeddings...${NC}"
    docker build -t liquid-lab-embeddings:latest ./services/embeddings --quiet
    echo -e "${GREEN}✓ embeddings${NC}"
else
    echo -e "${YELLOW}ℹ️  embeddings image já existe${NC}"
fi

# Liquid Lab API
if ! docker image inspect liquid-lab-liquid-lab-api:latest &> /dev/null; then
    echo -e "${BLUE}Building liquid-lab-api...${NC}"
    docker build -t liquid-lab-liquid-lab-api:latest -f code/Dockerfile.nemoclaw ./code --quiet
    echo -e "${GREEN}✓ liquid-lab-api${NC}"
else
    echo -e "${YELLOW}ℹ️  liquid-lab-api image já existe${NC}"
fi

echo ""

###############################################################################
# 5. K3S CLUSTER
###############################################################################

echo -e "${YELLOW}5️⃣  Verificando K3s cluster${NC}"
echo ""

# Check if cluster is running
if docker ps | grep -q liquidlab-cluster-nemoclaw; then
    echo -e "${GREEN}✓ K3s cluster${NC} liquidlab-cluster-nemoclaw já está rodando"
else
    echo -e "${YELLOW}ℹ️  K3s cluster não encontrado${NC}"
    echo "    Para criar um novo cluster:"
    echo "    docker run --name liquidlab-cluster-nemoclaw -d ..."
    echo ""
fi

echo ""

###############################################################################
# 6. RESUMO
###############################################################################

echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ SETUP COMPLETO${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Próximos passos:${NC}"
echo ""
echo "1️⃣  Verificar environment:"
echo "   cat .env.local"
echo ""
echo "2️⃣  Iniciar cluster K3s (se não estiver rodando):"
echo "   docker run --name liquidlab-cluster-nemoclaw \\"
echo "     -d -p 8080:30051 \\"
echo "     ghcr.io/nvidia/openshell/cluster:0.0.16"
echo ""
echo "3️⃣  Fazer deploy dos services:"
echo "   ./scripts/deploy-to-k3s.sh"
echo ""
echo "4️⃣  Verificar status:"
echo "   kubectl get pods -n liquid-lab"
echo "   kubectl get pods -n data-layer"
echo ""
echo -e "${BLUE}Documentação:${NC}"
echo "  - docs/ARCHITECTURE-LIQUIDLAB-NEMOCLAW.md"
echo "  - README.md"
echo ""

