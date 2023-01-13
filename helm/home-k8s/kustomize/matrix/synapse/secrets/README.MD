Run the below command from this current directory "secrets"
```
kubectl -n matrix create secret generic main --from-file source -o yaml --dry-run=client >> generated-secrets.yaml
```


my-svc.my-namespace.svc.cluster-domain.exampl
synapse-main.matrix.svc.cluster.local