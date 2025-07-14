#! /bin/bash

echo '[PetAgenda Deploy Script] Iniciando de deploy' \
&& scripts/setup_docker.sh \
&& docker compose up -d \
&& echo '[PetAgenda Deploy Script] PetAgenda implantado com sucesso!' \
|| echo "[PetAgenda Deploy Script] Falha ao realizar o deploy..."
