#!/bin/bash
sudo chown -R $(whoami) /opt/rye
cd api && rye sync
