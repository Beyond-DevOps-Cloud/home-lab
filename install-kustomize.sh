#!/bin/bash
# This is used to run helmsman and install charts.

# kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
# kubectl apply --filename https://storage.googleapis.com/tekton-releases/triggers/latest/release.yaml
# kubectl apply --filename https://storage.googleapis.com/tekton-releases/triggers/latest/interceptors.yaml

# kubectl apply -n tekton -f https://raw.githubusercontent.com/tektoncd/catalog/main/task/git-clone/0.9/git-clone.yaml

kubectl apply -n tekton-pipelines -f https://raw.githubusercontent.com/tektoncd/catalog/main/task/git-clone/0.9/git-clone.yaml
kustomize build ./helm/home-k8s | kubectl apply --prune --overwrite --all --wait -f -

# kustomize build ./helm/home-k8s | kubectl delete -f -