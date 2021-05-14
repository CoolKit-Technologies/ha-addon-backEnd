echo '运行之前请确保：'
echo '1. node端代码已编译'
echo '2. web端代码已打包'

sleep 1s

BASE_PATH='/d/MyDesktop'

# node端项目 路径
NODE_PATH='./cc.coolkit.ha.addon.server'
# web端项目 路径
WEB_PATH='./cc.coolkit.it.ha.addon.frontend'
# Gitee项目 路径
GITEE_PATH='./Home-Assistant-AddOn/eWeLink_Smart_Home'
# GitHub项目 路径
GITHUB_PATH='./ha-addon/eWeLink_Smart_Home'

cd $BASE_PATH

echo "cleaning dist..."
rm -rf $GITEE_PATH/dist
rm -rf $GITHUB_PATH/dist

echo "copying node code..."
# 拷贝服务端代码
cp -r $NODE_PATH/dist $GITEE_PATH
cp -r $NODE_PATH/dist $GITHUB_PATH

echo "creating pages..."
# 创建pages目录
mkdir -p $GITEE_PATH/dist/pages
mkdir -p $GITHUB_PATH/dist/pages

echo "copying index.html..."
# 拷贝index.html
cp -r $NODE_PATH/src/pages/index.html $GITEE_PATH/dist/pages
cp -r $NODE_PATH/src/pages/index.html $GITHUB_PATH/dist/pages

cd $WEB_PATH/dist

echo "copying web code..."
# 拷贝前端代码
cp -r $(ls | grep -v *.html | xargs) $BASE_PATH/Home-Assistant-AddOn/eWeLink_Smart_Home/dist/pages
cp -r $(ls | grep -v *.html | xargs) $BASE_PATH/ha-addon/eWeLink_Smart_Home/dist/pages

echo "success!!!"
