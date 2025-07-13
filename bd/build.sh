#! /bin/bash

cd $BUILD_PATH/bd

docker buildx build -t tbaiense/petagenda-bd -f Dockerfile .

