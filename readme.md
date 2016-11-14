
How to install docker and adocker compose, I think this should work onx86 and ARM
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