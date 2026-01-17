#!/bin/bash
export LANG=en_US.UTF-8
if ! command -v cf8 >/dev/null 2>&1; then
if command -v apk >/dev/null 2>&1; then
    apk add --no-cache curl tar bash
    curl -L "https://github.com/cloudfoundry/cli/releases/download/v8.16.0/cf8-cli_8.16.0_linux_x86-64.tgz" | tar -xz -C /usr/local/bin
    chmod +x /usr/local/bin/cf8
elif command -v apt >/dev/null 2>&1; then
    apt-get update && apt-get install -y wget gnupg
    wget -qO- https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | sudo gpg --yes --dearmor -o /usr/share/keyrings/cloudfoundry-cli-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/cloudfoundry-cli-archive-keyring.gpg] https://packages.cloudfoundry.org/debian stable main" | sudo tee /etc/apt/sources.list.d/cloudfoundry-cli.list > /dev/null
    apt-get update && apt-get install -y cf8-cli
else
    echo "脚本仅支持Alpine、Debian、Ubuntu系统"
    exit 1
fi
fi


if command -v apt >/dev/null 2>&1; then
if ! dpkg -l tzdata >/dev/null 2>&1; then
    apt-get update -y >/dev/null 2>&1 && apt-get install -y tzdata >/dev/null 2>&1
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime >/dev/null 2>&1
fi
elif command -v apk >/dev/null 2>&1; then
if ! apk info | grep tzdata >/dev/null 2>&1; then
    apk add --no-cache tzdata >/dev/null 2>&1
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime >/dev/null 2>&1
    echo "Asia/Shanghai" > /etc/timezone >/dev/null 2>&1
fi
fi


if ! command -v crond >/dev/null 2>&1; then
if command -v apk >/dev/null 2>&1; then
   apk add --no-cache cronie >/dev/null 2>&1
   rc-update add crond >/dev/null 2>&1 && rc-service crond start >/dev/null 2>&1
fi
elif ! command -v cron >/dev/null 2>&1; then
if command -v apt >/dev/null 2>&1; then
   apt-get update -y >/dev/null 2>&1 && apt-get install -y cron >/dev/null 2>&1
fi
fi


echo "*************************************"
echo "中国时间 $(date): SAP开始执行任务"
echo "运行cat $HOME/sap.log查看最近一次定时执行日志"
echo "*************************************"
# 设置区=====================================================================


# 必填！每个账号邮箱空一格
CF_USERNAMES=""


# 必填！每个账号对应密码空一格
CF_PASSWORDS=""


# 必填！每个账号对应地区空一格
REGIONS=""


# 必填！每个账号对应UUID空一格
UUIDS=""


# 选填！每个账号对应的应用程序名称APP空一格，不填则每个实例都自动生成，多个账号中有个别账号自动生成填no
APP_NAMES=""


# 选填！当使用Argo固定/临时隧道时，此端口变量必填，每个账号对应端口空一格，不填则每个实例都不启用argo，多个账号中有个别账号不启用填no
VMPTS="" 


# 选填！Argo固定隧道域名，每个账号对应域名空一格，不填则每个实例都启用argo临时隧道，多个账号中有个别账号不启用填no
AGNS="" 


# 选填！Argo固定隧道token，每个账号对应token空一格，不填则每个实例都启用argo临时隧道，多个账号中有个别账号不启用填no
