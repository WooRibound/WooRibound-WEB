#!/bin/bash
# ECR Push Script
docker tag wooribound/server:latest ${ECR_URI}/wooribound:web-latest
docker push ${ECR_URI}/wooribound:web-latest