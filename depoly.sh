#!/usr/bin/env sh
 
# 确保脚本抛出遇到的错误
set -e
 
# 生成静态文件， npm run docs:build
npm run build
rm -rf ../vue-fabric-draw-dist/*

# 将build生成的dist目录拷贝至上一层目录中
cp -r ./dist/* ../vue-fabric-draw-dist/

# 进入生成的文件夹
cd ../vue-fabric-draw-dist

# git初始化，每次初始化不影响推送
git init
git add -A
git commit -m 'deploy'
git branch -M main

# 如果你想要部署到 https://USERNAME.github.io
# git remote add origin https://github.com/more-strive/morestrive.github.io.git
git push -u origin main
git push -f https://github.com/more-strive/draw.git main
