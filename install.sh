#!/bin/bash
vermelho="\033[0;31m"
verde="\033[0;32m"
azul="\033[0;34m"
cyan="\033[0;36m"
branco="\033[1;37m"
tag="\033[0m"

clear
echo -e "${cyan}INSTALANDO CHECKUSER${tag}"
apt update -y > /dev/null 2>&1
curl -s https://deb.nodesource.com/setup_16.x | sudo bash > /dev/null 2>&1
sudo apt install nodejs -y > /dev/null 2>&1
apt install jq > /dev/null 2>&1
mkdir $HOME/check_user > /dev/null 2>&1
cd $HOME/check_user > /dev/null 2>&1
wget https://raw.githubusercontent.com/BrunoCode69/CheckUser---2024/main/index.js > /dev/null 2>&1
wget https://raw.githubusercontent.com/BrunoCode69/CheckUser---2024/main/config.json > /dev/null 2>&1
npm install pm2 --global > /dev/null 2>&1
cd $HOME
wget https://raw.githubusercontent.com/BrunoCode69/CheckUser---2024/main/check > /dev/null 2>&1
chmod 777 check
mv check /bin/check > /dev/null 2>&1
chmod 777 /bin/check > /dev/null 2>&1
clear
echo -e "${cyan}CHECKUSER INSTALADO COM SUCESSO.${tag}"
echo -e "\n${cyan}Comando principal: ${branco}check${tag}.${tag}"
echo -e "\n${cyan}Desenvolvido por: ${branco}@Bruno_VPN${tag}.${tag}"
