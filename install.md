//�⺻ ����

//�ѱ� ��Ʈ ��ġ
sudo apt install fonts-nanum
sudo apt install fonts-nanum-coding

//front-end ���� ����
mkdir ~/dist
cd 
cp LINC-Werfomace.io.tar.gz ~/dist
cd ~/dist
tar -zxvf tensorflow-web.tar.gz
npm install --prefix bundle/programs/server
cd bundle
pm2 start pm2.config.js


