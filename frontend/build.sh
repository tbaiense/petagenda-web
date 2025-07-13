#! /bin/bash

cd $BUILD_PATH/frontend

docker buildx build -t tbaiense/petagenda-frontend -f Dockerfile .
