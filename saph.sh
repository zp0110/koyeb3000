#!/bin/bash
export LANG=en_US.UTF-8
if ! command -v apk >/dev/null 2>&1 && ! command -v apt >/dev/null 2>&1; then
echo "脚本仅支持Alpine、Debian、Ubuntu系统" && exit
fi
[[ $EUID -ne 0 ]] && echo "请以root模式运行脚本" && exit
sapsbxinstall(){
URL="https://raw.githubusercontent.com/zp0110/koyeb3000/main/sapsbxh.sh"
DEST="$HOME/sapsbxh.sh"
command -v curl > /dev/null 2>&1 && curl -sSL $URL -o $DEST || wget -q $URL -O $DEST
if [ -s "$HOME/sapsbxh.sh" ]; then
chmod +x $HOME/sapsbxh.sh


echo
while true; do
read -p "必填！请输入SAP邮箱账号（每个账号邮箱空一格）: " input
if [ -z "$input" ]; then
echo "输入不能为空，请重新输入！"
else
break
fi
done
quoted=$(printf '%s ' $input)
sed -i "50s/^.*$/CF_USERNAMES=\"${quoted% }\"/" $HOME/sapsbxh.sh


echo
while true; do
read -p "必填！请输入SAP密码（每个账号对应密码空一格）: " input
if [ -z "$input" ]; then
echo "输入不能为空，请重新输入！"
else
break
fi
done
quoted=$(printf '%s ' $input)
sed -i "53s/^.*$/CF_PASSWORDS=\"${quoted% }\"/" $HOME/sapsbxh.sh


echo
while true; do
read -p "必填！请输入SAP地区（详见地区变量对照表，每个账号对应地区空一格）: " input
if [ -z "$input" ]; then
echo "输入不能为空，请重新输入！"
else
break
fi
done
quoted=$(printf '%s ' $input)
sed -i "56s/^.*$/REGIONS=\"${quoted% }\"/" $HOME/sapsbxh.sh


echo
while true; do
read -p "必填！请输入UUID（每个账号对应UUID空一格）: " input
if [ -z "$input" ]; then
echo "输入不能为空，请重新输入！"
else
break
fi
done
quoted=$(printf '%s ' $input)
sed -i "59s/^.*$/UUIDS=\"${quoted% }\"/" $HOME/sapsbxh.sh


echo
read -p "选填！请输入8:10-9:00点的保活时间间隔（单位:分钟，回车默认5分钟间隔）: " input
if [ -z "$input" ]; then
sed -i "62s/^.*$/crontime=5/" $HOME/sapsbxh.sh
else
sed -i "62s/^.*$/crontime=$input/" $HOME/sapsbxh.sh
fi
echo "脚本安装设置完毕"
echo "每天上午8:10-9:00之间脚本自动运行保活，可以再次进入脚本选择2测试执行一次" && sleep 3
