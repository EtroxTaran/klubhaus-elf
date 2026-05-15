FROM node:22-bookworm

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    docker-compose-plugin \
    docker.io \
    fuse-overlayfs \
    iptables \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/docker \
  && printf '%s\n' '{' '  "storage-driver": "fuse-overlayfs"' '}' > /etc/docker/daemon.json \
  && update-alternatives --set iptables /usr/sbin/iptables-legacy \
  && update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy

RUN corepack enable \
  && corepack prepare pnpm@11.1.2 --activate

WORKDIR /workspace
