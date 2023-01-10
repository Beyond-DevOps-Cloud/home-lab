Run the below command from this current directory "secrets"
```
kubectl -n matrix create secret generic main --from-file source -o yaml --dry-run=client >> generated-secrets.yaml
```