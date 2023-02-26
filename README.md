# home-lab

## Helmsman
```
docker run -it --rm --entrypoint /bin/sh -v "$(pwd):/app" -v "/home/lordmuffin/.kube/config:/home/root/.kube/config" -e KUBECONFIG=/home/root/.kube/config -w "/app" praqma/helmsman -c "helmsman --apply -f ./helm/home-k8s/home-k8s-lab.yaml"
```
```
docker run -it --rm --entrypoint /bin/sh -v "$(pwd):/app" -v "/home/lordmuffin/.kube/config:/home/root/.kube/config" -e KUBECONFIG=/home/root/.kube/config -w "/app" praqma/helmsman -c "./install.sh"
```


## Pulumi
docker run -it \
    -e PULUMI_ACCESS_TOKEN="access-token" \
    -e PROXMOX_VE_ENDPOINT="https://192.168.1.11:8006/" \
    -e PROXMOX_VE_INSECURE=true \
    -e PROXMOX_VE_USERNAME="pulumi@pve" \
    -e PROXMOX_VE_PASSWORD="pulumi" \
    -w "/app" \
    -v "$(pwd)/pulumi/proxmox:/app" \
    --entrypoint /bin/sh \
    pulumi/pulumi-nodejs \
    -c "pulumi plugin install resource proxmoxve v2.0.0 -f ./files/pulumi-resource-proxmoxve-v2.0.0-linux-arm64.tar.gz && pulumi plugin install resource proxmoxve v2.1.0 -f ./files/pulumi-resource-proxmoxve-v2.1.0-linux-arm64.tar.gz && npm install && npm ci && pulumi up --stack dev --non-interactive --skip-preview"

docker run -it \
    -e PULUMI_ACCESS_TOKEN="access-token" \
    -e PROXMOX_VE_ENDPOINT="https://192.168.1.11:8006/" \
    -e PROXMOX_VE_INSECURE=true \
    -e PROXMOX_VE_USERNAME="pulumi@pve" \
    -e PROXMOX_VE_PASSWORD="pulumi" \
    -w "/app" \
    -v "$(pwd)/pulumi/proxmox:/app" \
    --entrypoint /bin/sh \
    pulumi/pulumi-nodejs \
    -c "pulumi plugin install resource proxmoxve v2.0.0 -f ./files/pulumi-resource-proxmoxve-v2.0.0-linux-arm64.tar.gz && pulumi plugin install resource proxmoxve v2.1.0 -f ./files/pulumi-resource-proxmoxve-v2.1.0-linux-arm64.tar.gz && pulumi destroy --stack dev"

wget https://github.com/muhlba91/pulumi-proxmoxve/releases/download/v2.1.0/pulumi-resource-proxmoxve-v2.1.0-linux-arm64.tar.gz

pulumi plugin install resource proxmoxve v2.1.0 -f ./pulumi-resource-proxmoxve-v2.1.0-linux-arm64.tar.gz


## Argo Things:
### Install ArgoCD:
?? Still need to figure this out.

```
docker run -it --rm --entrypoint=/bin/sh -v "$(pwd):/work" -v "/home/lordmuffin/.kube/config:/home/root/.kube/config" -e KUBECONFIG=/home/root/.kube/config -w "/work" kubectl-kustomize-helm -c "kustomize build ./helm/home-k8s | kubectl apply --prune --overwrite --all --wait -f -"
```
### Init Argo:
Run this after ArgoCD is up and running.  Note the namespace!
```
docker run -it --rm --entrypoint=/bin/sh -v "$(pwd):/work" -v "/home/lordmuffin/.kube/config:/home/root/.kube/config" -e KUBECONFIG=/home/root/.kube/config -w "/work" kubectl-kustomize-helm -c "helm template helm/home-k8s/apps | kubectl apply -n argocd -f -"
```