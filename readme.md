## Installing

Diskpart to clean the disk, linux will use something else
```bash
sawaiz@roc> diskpart                                                                                                  

Microsoft DiskPart version 10.0.14393.0

Copyright (C) 1999-2013 Microsoft Corporation.
On computer: ROC

DISKPART> list disk

  Disk ###  Status         Size     Free     Dyn  Gpt
  --------  -------------  -------  -------  ---  ---
  Disk 0    Online          119 GB  1024 KB
  Disk 1    Online         7600 MB  3072 KB

DISKPART> select disk 1

Disk 1 is now the selected disk.

DISKPART> clean

DiskPart succeeded in cleaning the disk.

DISKPART> exit

Leaving DiskPart...

```

dd to copy a blank image
```bash
dd bs=4M if=/cygdrive/c/Users/sawaiz/Desktop/2016-09-23-raspbian-jessie-lite.img of=/dev/sdb
```
nmap to find ip address of pi

Next plugin the SDcard into the Raspberry Pi that is connected to a network, and boot. From another machine on the same network, run nmap, the ip address you give it should be your ip address logical and with your subnet mask.

```
 IpAddress & SubnetMask = 
```

For example, if running `ifconfig` returns the following

```bash
pi@raspberrypi:~ $ ifconfig eth0
eth0      Link encap:Ethernet  HWaddr b8:27:eb:3d:49:94
          inet addr:10.50.0.106  Bcast:10.50.0.255  Mask:255.255.255.0
          inet6 addr: fe80::4e4e:7f83:ccdb:acdb/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:17149 errors:0 dropped:0 overruns:0 frame:0
          TX packets:16026 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:20431295 (19.4 MiB)  TX bytes:1346078 (1.2 MiB)
```

Then `10.50.0.106 & 255.255.255.0 = 10.50.0.0` is the address used in the nmap command

```bash
nmap -sn 10.50.0.0/24
```

You should get a respons elike this
``` bash

```

Login from the nmap output



Copy ssh id
```bash
ssh-copy-id pi@10.50.0.106
```
expand filesystem, enable i2c


```bash
sudo apt-get update && sudo apt-get install git && git clone http://github.com/sawaiz/cosmicNetwork && cd cosmicNetwork && sudo ./setup.sh
```

How to install docker and a docker compose, I think this should work onx86 and ARM
```bash
curl -sSL https://get.docker.com | sh
sudo apt-get -y install python-pip
sudo pip install docker-compose
```

Fix your ntp clock if you are on a corporate network that has ntp porblems, no RTC on a pi, so clock must get from network.

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