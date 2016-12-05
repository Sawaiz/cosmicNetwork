## Installing
dd to copy a blank image
```bash
dd bs=4M if=/cygdrive/c/Users/sawaiz/Desktop/2016-09-23-raspbian-jessie-lite.img of=/dev/sdb
```
nmap to find ip address of pi
```bash
nmap
```
Copy ssh id
```bash
ssh-copy-id pi@10.50.0.106
```
expand filesystem, enable i2c


How to install docker and a docker compose, I think this should work onx86 and ARM
```bash
curl -sSL https://get.docker.com | sh
sudo apt-get -y install python-pip
sudo pip install docker-compose
```

Installing a samba server on the pi lets you make a network mount, and then you can edit code locally.
```bash
sudo apt-get install samba
sudo smbpasswd -a cosmic
sudo cp /etc/samba/smb.conf ~
sudo nano /etc/samba/smb.conf
sudo service smbd restart
testparm
```

sudo mount -t cifs //131.96.166.37/cosmicNetwork /home/cosmic/cosmicNetwork -o username=sawaiz

npm install --no-bin-links