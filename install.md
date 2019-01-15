//기본 설정

//한글 폰트 설치
sudo apt install fonts-nanum
sudo apt install fonts-nanum-coding

//front-end 서버 실행
mkdir ~/dist
cd 
cp LINC-Werfomace.io.tar.gz ~/dist
cd ~/dist
tar -zxvf tensorflow-web.tar.gz
npm install --prefix bundle/programs/server
cd bundle
pm2 start pm2.config.js


