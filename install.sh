#!/bin/bash
# This is used to run helmsman and install charts.

# kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
# kubectl apply --filename https://storage.googleapis.com/tekton-releases/triggers/latest/release.yaml
# kubectl apply --filename https://storage.googleapis.com/tekton-releases/triggers/latest/interceptors.yaml

# kubectl apply -n tekton -f https://raw.githubusercontent.com/tektoncd/catalog/main/task/git-clone/0.9/git-clone.yaml

helmsman --apply -f ./helm/home-k8s/home-k8s-lab.yaml
