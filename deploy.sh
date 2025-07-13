#! /bin/bash

cd $PWD/scripts

echo '[PetAgenda Deploy Script] Iniciando de deploy' \
&& ./setup_docker.sh \
&& cd .. \
&& docker compose up -d \
&& echo '[PetAgenda Deploy Script] PetAgenda implantado com sucesso!' \
|| echo "[PetAgenda Deploy Script] Falha ao realizar o deploy..."
