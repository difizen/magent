#!/bin/bash


echo 'alias start-api="cd /workspaces/magent/api && uvicorn main:app --reload"' >> ~/.bashrc
echo 'alias db-migrate="cd /workspaces/magent/api && alembic revision --autogenerate"' >> ~/.bashrc
echo 'alias db-upgrade="cd /workspaces/magent/api && alembic upgrade head"' >> ~/.bashrc
echo 'alias start-containers="cd /workspaces/magent/docker && docker-compose -f docker-compose-dev.yaml -p magent-dev up -d"' >> ~/.bashrc
echo 'export PATH=$PATH:/workspaces/magent/.venv/bin' >> ~/.bashrc 

source ~/.bashrc
