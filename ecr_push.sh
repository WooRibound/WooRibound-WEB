#!/bin/bash
echo "Registry URI: ${REGISTRY_URI}"
docker images
docker tag wooribound/web:latest "${REGISTRY_URI}/wooribound:web-latest"
docker push "${REGISTRY_URI}/wooribound:web-latest"
