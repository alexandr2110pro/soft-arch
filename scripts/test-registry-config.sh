#!/bin/bash

# Test script to demonstrate registry configuration behavior
# This shows how the system switches between local and npm registries

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testing Registry Configuration${NC}"
echo ""

# Test 1: Default behavior (local registry)
echo -e "${YELLOW}📋 Test 1: Default Configuration (Local Development)${NC}"
echo -e "Default registry: $(npm config get registry)"
echo -e "Scoped registry: $(npm config get @space-arch:registry)"
echo ""

# Test 2: Environment variable override 
echo -e "${YELLOW}📋 Test 2: Environment Variable Override (CI Mode)${NC}"
export NPM_REGISTRY=https://registry.npmjs.org
echo -e "NPM_REGISTRY override: $NPM_REGISTRY"
echo -e "Would resolve to: $(NPM_REGISTRY=https://registry.npmjs.org npm config get registry)"
echo ""

# Test 3: Show what nx release would do
echo -e "${YELLOW}📋 Test 3: Nx Release Registry Detection${NC}"
echo -e "Testing dry-run with local registry (will fail if Verdaccio not running):"
if ! pnpm dlx nx release --dry-run --skip-publish 2>/dev/null; then
    echo -e "${RED}❌ Expected failure - Verdaccio not running${NC}"
else
    echo -e "${GREEN}✅ Worked - Verdaccio is running${NC}"
fi
echo ""

echo -e "Testing dry-run with npm registry override:"
if NPM_REGISTRY=https://registry.npmjs.org pnpm dlx nx release --dry-run --skip-publish 2>/dev/null; then
    echo -e "${GREEN}✅ Success - npm registry accessible${NC}"
else
    echo -e "${RED}❌ Failed - check npm access${NC}"
fi
echo ""

# Test 4: Show workflow behavior
echo -e "${YELLOW}📋 Test 4: Workflow Behavior Summary${NC}"
echo -e "${BLUE}Local Development:${NC}"
echo -e "  • Registry: ${YELLOW}http://localhost:4873${NC} (Verdaccio)"
echo -e "  • Command: ${YELLOW}pnpm dlx nx release --dry-run${NC}"
echo -e "  • Environment: NPM_REGISTRY not set"
echo ""
echo -e "${BLUE}CI/Production:${NC}"
echo -e "  • Registry: ${YELLOW}https://registry.npmjs.org${NC} (npm)"
echo -e "  • Command: ${YELLOW}pnpm dlx nx release${NC}"
echo -e "  • Environment: NPM_REGISTRY=https://registry.npmjs.org"
echo ""

# Test 5: Show file configuration
echo -e "${YELLOW}📋 Test 5: Configuration Files${NC}"
echo -e "${BLUE}.npmrc configuration:${NC}"
echo -e "$(head -5 .npmrc)"
echo ""
echo -e "${BLUE}nx.json publish configuration:${NC}"
echo -e "$(grep -A 2 'publish' nx.json)"
echo ""

echo -e "${GREEN}🎉 Registry configuration test complete!${NC}" 