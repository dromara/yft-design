#!/usr/bin/env sh
 
# 确保脚本抛出遇到的错误
set -e
 
# 生成静态文件， npm run docs:build
npm run build
rm -rf ../design/*

# 将build生成的dist目录拷贝至上一层目录中
cp -r ./dist/* ../design/

# 进入生成的文件夹
cd ../design

# git初始化，每次初始化不影响推送
git init
git add -A
git commit -m 'deploy'
git branch -M main

# 如果你想要部署到 https://USERNAME.github.io
# git remote add origin https://github.com/more-strive/morestrive.github.io.git
git push -u origin main
git push -f https://github.com/more-strive/design.git main
