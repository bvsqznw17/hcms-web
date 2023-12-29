#!/bin/bash
#docker部分

echo '================打包完成，开始制作镜像================'

echo '================停止容器 hcms================'
docker stop hcms
echo '================删除容器 hcms================'
docker rm hcms
echo '================删除镜像 hcms:last================'
docker rmi hcms:last
echo '================修改上一次的镜像名 hcms:latest================'
docker tag hcms:latest hcms:last
echo '================build 镜像 hcms:latest================'
docker build -t hcms:latest  .
# echo '================运行容器 hcms================'
# docker run --name=hcms --restart always -d -p 18091:80  hcms:latest

# echo "finished!"
# echo '================部署完成================'
