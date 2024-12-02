#!/bin/bash
# Debug outputs
docker images
echo "Full tag: ${REGISTRY_URI}/wooribound:web-latest"

# Try with explicit URL format
docker tag wooribound/web:latest "${REGISTRY_URI}/wooribound:web-latest"
docker images   # Check if tag was successful
docker push "${REGISTRY_URI}/wooribound:web-latest"
