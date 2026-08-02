#!/bin/bash
set -e

WORKSPACE_DIR="/Users/mridulavengathattil/Downloads/Dryway"
NODE_VERSION="v20.15.1"
NODE_DIR="$WORKSPACE_DIR/.node"
TARBALL="node-$NODE_VERSION-darwin-arm64.tar.gz"
URL="https://nodejs.org/dist/$NODE_VERSION/$TARBALL"

echo "Setting up local Node.js environment in $NODE_DIR..."

if [ -d "$NODE_DIR" ]; then
    echo "Local node directory already exists. Checking version..."
    if "$NODE_DIR/bin/node" -v | grep -q "$NODE_VERSION"; then
        echo "Valid Node.js version already installed."
        exit 0
    else
        echo "Incorrect version or broken install. Removing existing directory..."
        rm -rf "$NODE_DIR"
    fi
fi

mkdir -p "$NODE_DIR"

echo "Downloading Node.js $NODE_VERSION for macOS arm64..."
curl -L "$URL" -o "/tmp/$TARBALL"

echo "Extracting Node.js..."
tar -xzf "/tmp/$TARBALL" -C "$NODE_DIR" --strip-components=1

echo "Cleaning up download..."
rm "/tmp/$TARBALL"

echo "Node.js installed successfully!"
echo "Node path: $NODE_DIR/bin/node"
"$NODE_DIR/bin/node" -v
"$NODE_DIR/bin/npm" -v
