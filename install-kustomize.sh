#!/bin/bash
# This is used to run helmsman and install charts.

# kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
# kubectl apply --filename https://storage.googleapis.com/tekton-releases/triggers/latest/release.yaml
# kubectl apply --filename https://storage.googleapis.com/tekton-releases/triggers/latest/interceptors.yaml

kustomize build ./helm/home-k8s --enable-helm | kubectl apply --prune --overwrite --all --wait -f -

# kustomize build ./helm/home-k8s | kubectl delete -f -