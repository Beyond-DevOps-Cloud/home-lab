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

<!-- Creating namespace first for argocd -->
```
kubectl create namespace argocd
```

```
docker run -it --rm --entrypoint=/bin/sh -v "$(pwd):/work" -v "/home/lordmuffin/.kube/config:/home/root/.kube/config" -e KUBECONFIG=/home/root/.kube/config -w "/work" gatsinski/kubectl-kustomize-helm:latest -c "kustomize build ./helm/home-k8s | kubectl apply --prune --overwrite --all --wait -f -"
```
<!-- DELETE STACK -->
```
docker run -it --rm --entrypoint=/bin/sh -v "$(pwd):/work" -v "/home/lordmuffin/.kube/config:/home/root/.kube/config" -e KUBECONFIG=/home/root/.kube/config -w "/work" gatsinski/kubectl-kustomize-helm:latest -c "kustomize build ./helm/home-k8s | kubectl delete -f -"
```

### Install ORM (Before Argo Init):
```
curl -L https://github.com/operator-framework/operator-lifecycle-manager/releases/download/v0.25.0/install.sh -o install.sh
chmod +x install.sh
./install.sh v0.25.0
```

kubectl label ns olm pod-security.kubernetes.io/enforce=privileged --overwrite

### Init Argo:
Run this after ArgoCD is up and running.  Note the namespace!
NEED NEW IMAGE FOR THIS
```
docker run -it --rm --entrypoint=/bin/sh -v "$(pwd):/work" -v "/home/lordmuffin/.kube/config:/home/root/.kube/config" -e KUBECONFIG=/home/root/.kube/config -w "/work" vladius25/helm-kubectl-kustomize:v1.20.5-v3.5.3-v4.3.0 -c "helm template helm/home-k8s/apps | kubectl apply -n argocd -f -"
```


docker pull vladius25/helm-kubectl-kustomize


### Cleanup failing to delete ns
kubectl get ns adguard-home -o json | \
  jq '.spec.finalizers=[]' | \
  curl -X PUT http://localhost:8001/api/v1/namespaces/adguard-home/finalize -H "Content-Type: application/json" --data @-

(
NAMESPACE=code-server
kubectl proxy &
kubectl get namespace $NAMESPACE -o json |jq '.spec = {"finalizers":[]}' >temp.json
curl -k -H "Content-Type: application/json" -X PUT --data-binary @temp.json 127.0.0.1:8001/api/v1/namespaces/$NAMESPACE/finalize
)
