FROM alpine/git

ENV KUBECTL_VERSION=1.22.3 \
    KUSTOMIZE_VERSION=4.4.0 \
    HELM_VERSION=3.7.1

WORKDIR /usr/src/app

RUN apk -v --update add --no-cache curl bash

RUN curl -sfL https://storage.googleapis.com/kubernetes-release/release/v${KUBECTL_VERSION}/bin/linux/amd64/kubectl -o /usr/local/bin/kubectl && \
    chmod +x /usr/local/bin/kubectl

RUN curl -sfL https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv${KUSTOMIZE_VERSION}/kustomize_v${KUSTOMIZE_VERSION}_linux_amd64.tar.gz -o kustomize.tar.gz && \
    tar -xf kustomize.tar.gz && \
    mv kustomize /usr/local/bin && \
    chmod +x /usr/local/bin/kustomize

RUN curl -sfL https://get.helm.sh/helm-v${HELM_VERSION}-linux-amd64.tar.gz -o helm.tar.gz && \
    tar -xf helm.tar.gz && \
    mv linux-amd64/helm /usr/local/bin && \
    chmod +x /usr/local/bin/helm

RUN rm -rf ./*

CMD ["bash"]