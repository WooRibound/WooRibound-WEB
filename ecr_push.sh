#!/bin/bash
# ECR Push Script
docker tag wooribound/web:latest ${REGISTRY_URI}/wooribound:web-latest
docker push ${REGISTRY_URI}/wooribound:web-latest