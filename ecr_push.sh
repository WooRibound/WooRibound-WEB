#!/bin/bash
docker tag wooribound/web:latest "${REGISTRY_URI}/wooribound/wooribound:web-latest"
docker push "${REGISTRY_URI}/wooribound/wooribound:web-latest"
