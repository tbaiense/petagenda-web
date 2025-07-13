#! /bin/bash

cd $PWD && cd ../repos

export BUILD_PATH=$PWD

echo '[UPDATE ALL] Iniciando processo de atualização de imagens Docker' \
&& bd/build.sh \
&& backend/build.sh \
&& frontend/build.sh \
&& echo '[UPDATE ALL] Imagens atualizadas com sucesso!' \
|| echo "[UPDATE ALL] Falha ao atualizar uma ou mais imagens"
