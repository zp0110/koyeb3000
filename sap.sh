#!/bin/bash
export LANG=en_US.UTF-8
if ! command -v apk >/dev/null 2>&1 && ! command -v apt >/dev/null 2>&1; then
echo "脚本仅支持Alpine、Debian、Ubuntu系统" && exit
fi
[[ $EUID -ne 0 ]] && echo "请以root模式运行脚本" && exit
sapsbxinstall(){
URL="https://raw.githubusercontent.com/zp0110/koyeb3000/main/sapsbx.sh"
DEST="$HOME/sapsbx.sh"
command -v curl > /dev/null 2>&1 && curl -sSL $URL -o $DEST || wget -q $URL -O $DEST
if [ -s "$HOME/sapsbx.sh" ]; then
chmod +x $HOME/sapsbx.sh


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
sed -i "50s/^.*$/CF_USERNAMES=\"${quoted% }\"/" $HOME/sapsbx.sh


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
sed -i "53s/^.*$/CF_PASSWORDS=\"${quoted% }\"/" $HOME/sapsbx.sh


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
sed -i "56s/^.*$/REGIONS=\"${quoted% }\"/" $HOME/sapsbx.sh


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
sed -i "59s/^.*$/UUIDS=\"${quoted% }\"/" $HOME/sapsbx.sh


echo
echo "每个账号对应SAP应用程序名称APP空一格，回车则每个实例都自动生成，多个账号中有个别账号自动生成填no"
read -p "选填！请输入SAP应用程序名称APP: " input
if [ -z "$input" ]; then
sed -i "62s/^.*$/APP_NAMES=\"\"/" $HOME/sapsbx.sh
else
quoted=$(printf '%s ' $input)
sed -i "62s/^.*$/APP_NAMES=\"${quoted% }\"/" $HOME/sapsbx.sh
fi
