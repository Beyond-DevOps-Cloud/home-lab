#!/bin/bash
hostname=$1
ip=$2

hostnamectl set-hostname $hostname
netplan_path="/etc/netplan/00-installer-config.yaml"
netplan_file="
# This is the network config written by 'subiquity'
network:
  renderer: networkd
  ethernets:
    ens18:
      addresses:
        - $ip/24
      nameservers:
        addresses: [4.2.2.2, 8.8.8.8]
      routes:
        - to: default
          via: 192.168.1.1
  version: 2"

rm -f $netplan_path

echo "$netplan_file" > $netplan_path

reboot
