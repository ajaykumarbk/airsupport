#!/bin/bash
# Production Docker Build and Push Script

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGISTRY_URL="${1:-docker.io}"
NAMESPACE="${2:-gw}"
BACKEND_IMAGE="gw-dashboard-backend"
FRONTEND_IMAGE="gw-dashboard-frontend"
VERSION="${3:-latest}"

echo -e "${BLUE}=== GW Dashboard Docker Build Script ===${NC}"
echo -e "Registry: ${REGISTRY_URL}"
echo -e "Namespace: ${NAMESPACE}"
echo -e "Version: ${VERSION}\n"

# Function to build image
build_image() {
    local service=$1
    local image_name=$2
    
    echo -e "${BLUE}Building ${service}...${NC}"
    
    if docker build -t "${image_name}:${VERSION}" "./${service}"; then
        echo -e "${GREEN}✓ ${service} built successfully${NC}\n"
        return 0
    else
        echo -e "${RED}✗ Failed to build ${service}${NC}\n"
        return 1
    fi
}

# Function to tag image for registry
tag_image() {
    local local_image=$1
    local registry_image=$2
    
    echo -e "${BLUE}Tagging ${local_image} for registry...${NC}"
    docker tag "${local_image}:${VERSION}" "${registry_image}:${VERSION}"
    docker tag "${local_image}:${VERSION}" "${registry_image}:latest"
    echo -e "${GREEN}✓ Tagged successfully${NC}\n"
}

# Function to push image
push_image() {
    local image=$1
    
    echo -e "${BLUE}Pushing ${image}...${NC}"
    
    if docker push "${image}:${VERSION}"; then
        docker push "${image}:latest"
        echo -e "${GREEN}✓ Push successful${NC}\n"
        return 0
    else
        echo -e "${RED}✗ Failed to push ${image}${NC}\n"
        return 1
    fi
}

# Build images
build_image "backend" "${BACKEND_IMAGE}" || exit 1
build_image "frontend" "${FRONTEND_IMAGE}" || exit 1

# If registry provided, tag and push
if [ "${REGISTRY_URL}" != "docker.io" ] || [ "${NAMESPACE}" != "gw" ]; then
    echo -e "${YELLOW}Tagging for registry...${NC}\n"
    
    BACKEND_REGISTRY="${REGISTRY_URL}/${NAMESPACE}/${BACKEND_IMAGE}"
    FRONTEND_REGISTRY="${REGISTRY_URL}/${NAMESPACE}/${FRONTEND_IMAGE}"
    
    tag_image "${BACKEND_IMAGE}" "${BACKEND_REGISTRY}"
    tag_image "${FRONTEND_IMAGE}" "${FRONTEND_REGISTRY}"
    
    read -p "Do you want to push images to registry? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        push_image "${BACKEND_REGISTRY}" || exit 1
        push_image "${FRONTEND_REGISTRY}" || exit 1
    fi
fi

echo -e "${GREEN}=== Build Complete ===${NC}"
echo -e "\n${BLUE}Next steps:${NC}"
echo "1. Verify images: docker images | grep gw-dashboard"
echo "2. Test locally: docker-compose up -d"
echo "3. Check health: docker-compose ps"
echo "4. View logs: docker-compose logs -f"
