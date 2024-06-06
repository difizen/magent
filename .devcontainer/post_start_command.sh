#!/bin/bash
sudo chown -R $(whoami) /opt/rye

cd /workspaces/magent/docker && docker-compose -f docker-compose-dev.yaml -p magent-dev up -d

cd /workspaces/magent/api && rye sync
