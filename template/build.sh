#!/bin/bash
source ~/.nvm/nvm.sh
nvm use v10.10.0

pid=$$

set -x

RELEASE_COPY="./*"
RELEASE_DIR="output"
TMP_DIR="/tmp/output.${pid}"
WORKER_DIR=$(cd $(dirname $0) && pwd -P)

cd $WORKER_DIR

mkdir -p $TMP_DIR

npm install
ret=$?
if [ $ret -ne 0 ];then
    echo "===== $npm install failure ====="
    exit $ret
else
    echo -n "===== $npm install successfully! ====="
fi

rm -rf $RELEASE_DIR

cp -rf $RELEASE_COPY $TMP_DIR

mkdir $RELEASE_DIR

mv $TMP_DIR/* $RELEASE_DIR

# 编译成功
echo -e "build done"
exit 0
