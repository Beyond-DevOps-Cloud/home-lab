#!/bin/bash

# Start cluster
export K3S_TOKEN="secret_cluster_token"
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.23.14+k3s1 K3S_TOKEN=$K3S_TOKEN sh -s - server --disable=traefik --disable=servicelb --cluster-init

# Add cluster server node
export K3S_TOKEN="secret_cluster_token"
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.23.14+k3s1 K3S_TOKEN=$K3S_TOKEN sh -s - server --disable=traefik --disable=servicelb --server https://192.168.1.20:6443


# Add worker node
export K3S_TOKEN="secret_cluster_token"
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.23.14+k3s1 K3S_TOKEN=$K3S_TOKEN K3S_URL=https://192.168.1.20:6443 sh -



/usr/local/bin/k3s-uninstall.sh

/usr/local/bin/k3s-agent-uninstall.sh

