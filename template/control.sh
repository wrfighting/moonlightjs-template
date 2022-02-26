#!/bin/bash

source ~/.bashrc
MODULE="<$ name $>"
LOG_DIR=/<$ name $>/log
workspace=$(cd $(dirname $0) && pwd -P)
PRE="xxxx"

function start() {
    [ ! -d $LOG_DIR ] && mkdir -p $LOG_DIR
        local clusterfile="xxx"
            if [[ -f "$clusterfile" ]]; then
                local cluster=`cat $clusterfile`
                if [ $cluster == $PRE ]; then
                    cd /$MODULE && npm run pmpre
                else
                    cd /$MODULE && npm run pmprod
                fi
            else
               cd /$MODULE && npm run pmprod
            fi
        echo "app start"
}


function stop() {
    pm2 stop all
    echo "app stop"
}

function httpRequest() {
    #curl 请求
    local clusterfile="xxx"
                if [[ -f "$clusterfile" ]]; then
                    local cluster=`cat $clusterfile`
                    if [ $cluster == $PRE ]; then
                          info=`curl -s -m 10 --connect-timeout 10 -I 127.0.0.1:8011/serveralive`
                    else
                        info=`curl -s -m 10 --connect-timeout 10 -I 127.0.0.1:3000/serveralive`
                    fi
                else
                   info=`curl -s -m 10 --connect-timeout 10 -I 127.0.0.1:3000/serveralive`
                fi

    #获取返回码
    code=`echo $info|grep "HTTP"|awk '{print $2}'`
    #对响应码进行判断
    if [ "$code" == "200" ];then
        echo "请求成功，响应码是$code"
        exit 0
    else
        echo "请求失败，响应码是$code"
        exit 1
    fi
}

action=$1
case $action in
    "start" )
        # 启动服务
        start
        sleep 3
        httpRequest
        ;;
    "stop" )
        # 停止服务
        stop
        ;;
    * )
        echo "unknown command"
        exit 1
        ;;
esac
