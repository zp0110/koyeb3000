koyeb3000在SAP平台部署代理节点，基于[eooce](https://github.com/eooce/Auto-deploy-sap-and-keepalive)相关功能现实，可用vless-ws-tls(cdn)、vmess-ws-argo-cdn、vmess-ws-tls-argo-cdn




Vless-ws-tls为默认安装，Argo固定或临时隧道为可选，也可使用[workers/pages反代方式](https://github.com/zp0110/koyeb3000/blob/main/_worker.js)启用Vless-ws-tls的CDN替代Argo的CDN




SAP个人注册地址：https://www.sap.com/products/technology-platform/trial.html




----------------------------------------- 




#### 注意：目前以下三种方式自动部署，方式二与三带保活！！！




* 方式一：[Github方式](https://github.com/zp0110/koyeb3000/blob/main/.github/workflows/main.yml)，请自建私库设置运行。安装启动同时进行，无定时保活




* 方式二：Docker方式，镜像地址：```ygkkk/sapsbx```，可在clawcloud爪云等docker平台上运行。安装启动同时进行，自带8:10-9:00每5分钟的定时保活




* 方式三：VPS服务器方式。安装启动同时进行，支持自定义8:10-9:00定时保活时间段间隔




VPS服务器方式脚本地址：（再次进入快捷方式```bash sap.sh```）：




```curl -sSL https://raw.githubusercontent.com/zp0110/koyeb3000/main/sap.sh -o sap.sh && chmod +x sap.sh && bash sap.sh```




或者




```wget -q https://raw.githubusercontent.com/zp0110/koyeb3000/main/sap.sh -O sap.sh && chmod +x sap.sh && bash sap.sh```




----------------------------------------- 




#### 注意：以下三种方式仅支持保活！仅```CF_USERNAMES ``` ```CF_PASSWORDS``` ```REGIONS``` ```UUIDS```四个变量可用且为必填




* 方式一：[Github方式](https://github.com/zp0110/koyeb3000/blob/main/.github/workflows/mainh.yml)，请自建私库设置运行。仅适用手动保活




* 方式二：Docker方式，镜像地址：```ygkkk/sapsbxh```，可在clawcloud爪云等docker平台上运行。仅保活，自带8:10-9:00每5分钟的定时保活




* 方式三：VPS服务器方式。仅保活，支持自定义8:10-9:00定时保活时间段间隔




VPS服务器方式脚本地址：（再次进入快捷方式```bash saph.sh```）：




```curl -sSL https://raw.githubusercontent.com/zp0110/koyeb3000/main/saph.sh -o saph.sh && chmod +x saph.sh && bash saph.sh```




或者




```wget -q https://raw.githubusercontent.com/zp0110/koyeb3000/main/saph.sh -O saph.sh && chmod +x saph.sh && bash saph.sh```




----------------------------------------- 




* 变量设置说明：每个变量的多个账号需按顺序依次对应填写，多个之间空一格，多个中如有个别留空则填```no```代替
  
| 变量名称 | 变量值 | 是否必填 | 变量作用 |
| :----- | :-------- | :-------- | :--- |
| CF_USERNAMES | 单个或多个SAP账号邮箱  | 必填  | 登录账号 |
