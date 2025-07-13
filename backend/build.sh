#! /bin/bash

cd $BUILD_PATH/backend

docker buildx build -t tbaiense/petagenda-backend -f Dockerfile .

