#!/bin/bash

hostnamectl set-hostname $hostname

sudo su

read -r -d '' CONFIG << EOM
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
     addresses: 
        - [$ip]/24
     routes:
        - to: default
          via: 192.168.1.1
     nameservers:
       addresses: [8.8.8.8,8.8.4.4]
EOM

echo "$CONFIG" > /etc/netplan/00-installer-config.yaml
netplan apply

sudo sysctl fs.inotify.max_user_instances=1280
sudo sysctl fs.inotify.max_user_watches=655360

reboot