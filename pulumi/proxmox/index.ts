import * as pulumi from "@pulumi/pulumi";
import { local, remote, types } from "@pulumi/command";
import * as proxmox from '@muhlba91/pulumi-proxmoxve';
import { interpolate, Output } from "@pulumi/pulumi";
import { VirtualMachine } from "@muhlba91/pulumi-proxmoxve/vm";

const config = new pulumi.Config();
export const sshPassword = config.require("ssh-pass");

function calculateNextIp(start_ip: string): string[] {
    var last2: number = parseInt(start_ip.slice(-2), 10);
    last2 = last2 + 1;
    var slice_ip = start_ip.substring(0, start_ip.length -2);
    
    var next_ip = slice_ip + last2;

    return [start_ip, next_ip];
};

function addLeadingZeros(num: number, totalLength: number): string {
    if (num < 0) {
      const withoutMinus = String(num).slice(1);
      return '-' + withoutMinus.padStart(totalLength, '0');
    }
  
    return String(num).padStart(totalLength, '0');
};

function return_clone_vm_id(node_name: string): number {
    if(node_name = "pve"){
        return pve_clone_vm_id
    }
    else{
        return pverouter_clone_vm_id
    }
}

const provider = new proxmox.Provider('proxmoxve', {
  virtualEnvironment: {
    endpoint: process.env.PROXMOX_VE_ENDPOINT,
    insecure: true,
    username: process.env.PROXMOX_VE_USERNAME,
    password: process.env.PROXMOX_VE_PASSWORD
  }
});

let node_names: string[] = ["pve", "pve-router"];

const clone_node_name = "pve";
const pve_clone_vm_id = 102;
const pverouter_clone_vm_id = 101;
let clone_vm_id = 0;

const disk_size = 40;

const k3s_server_list = [
    {
        hostname: "k3s-server-001",
        node: node_names[0],
        ip: "192.168.1.20",
        memory: 2048
    },
    {
        hostname: "k3s-server-002",
        node: node_names[1],
        ip: "192.168.1.21",
        memory: 2048
    },
]
const k3s_agent_list = [
    {
        hostname: "k3s-agent-001",
        node: node_names[0],
        ip: "192.168.1.30",
        memory: 4096
    },
    {
        hostname: "k3s-agent-002",
        node: node_names[1],
        ip: "192.168.1.31",
        memory: 4096
    },
]

// Loop for servers

for(let server in k3s_server_list){
    let value = k3s_server_list[server]
    const ip = value["ip"]
    const server_name = value["hostname"];
    clone_vm_id = return_clone_vm_id(value["node"]);

    console.log("### STARTING LOGS ###");
    console.log(ip);
    console.log(value["node"]);
    console.log(server_name);
    console.log("### ENDING LOGS ###");

    const virtualMachine = new proxmox.vm.VirtualMachine(value["node"] + "-" + server_name, {
        nodeName: value["node"],
        agent: {
            enabled: true, // toggles checking for ip addresses through qemu-guest-agent
            trim: true,
            type: 'virtio',
        },
        bios: 'seabios',
        cpu: {
            cores: 1,
            sockets: 1,
        },
        clone: {
            nodeName: clone_node_name,
            vmId: clone_vm_id,
            full: true,
        },
        disks: [
            {
                interface: 'scsi0',
                datastoreId: 'local-lvm',
                size: disk_size,
                fileFormat: 'qcow2',
            },
        ],
        memory: {
            dedicated: value["memory"],
        },
        name: server_name,
        networkDevices: [
            {
                bridge: 'vmbr0',
                model: 'virtio',
            },
        ],
        onBoot: true,
        operatingSystem: {
            type: 'l26',
        }
    },
    {
        provider: provider,
        customTimeouts: { create: "30m" } 
    });
    console.log(virtualMachine.id);

    const connection: types.input.remote.ConnectionArgs = {
        host: virtualMachine.ipv4Addresses[1][0],
        user: "lordmuffin",
        password: sshPassword,
    };

    const copyFile = new remote.CopyFile("CopyFile" + server_name, {
        connection,
        localPath: "./files/set-ip.sh",
        remotePath: "set-ip.sh",
    }, { dependsOn: virtualMachine });
    
    const chmod = new remote.Command("Chmod" + server_name, {
        connection,
        create: "chmod +x ./set-ip.sh",
    }, { dependsOn: copyFile })

    const setStatic = new remote.Command("SetStatic" + server_name, {
        connection,
        create: "sudo sh ./set-ip.sh " + server_name + " " + ip,
        environment: {
            hostname: server_name,
            ip: ip,
        }
    }, { dependsOn: chmod })
    
}


for(let agent in k3s_agent_list){
    let value = k3s_agent_list[agent]
    const ip = value["ip"]
    const agent_name = value["hostname"];
    clone_vm_id = return_clone_vm_id(value["node"]);

    console.log("### STARTING LOGS ###");
    console.log(ip);
    console.log(value["node"]);
    console.log(agent_name);
    console.log("### ENDING LOGS ###");

    const virtualMachine2 = new proxmox.vm.VirtualMachine(value["node"] + "-" + agent_name, {
        nodeName: value["node"],
        agent: {
            enabled: true, // toggles checking for ip addresses through qemu-guest-agent
            trim: true,
            type: 'virtio',
        },
        bios: 'seabios',
        cpu: {
            cores: 1,
            sockets: 1,
        },
        clone: {
            nodeName: clone_node_name,
            vmId: clone_vm_id,
            full: true,
        },
        disks: [
            {
                interface: 'scsi0',
                datastoreId: 'local-lvm',
                size: disk_size,
                fileFormat: 'qcow2',
            },
        ],
        memory: {
            dedicated: value["memory"],
        },
        name: agent_name,
        networkDevices: [
            {
                bridge: 'vmbr0',
                model: 'virtio',
            },
        ],
        onBoot: true,
        operatingSystem: {
            type: 'l26',
        }
    },
    {
        provider: provider,
        customTimeouts: { create: "30m" } 
    });
    console.log(virtualMachine2.id);

    const connection: types.input.remote.ConnectionArgs = {
        host: virtualMachine2.ipv4Addresses[1][0],
        user: "lordmuffin",
        password: sshPassword,
    };

    const copyFile = new remote.CopyFile("CopyFile" + agent_name, {
        connection,
        localPath: "./files/set-ip.sh",
        remotePath: "set-ip.sh",
    }, { dependsOn: virtualMachine2 });
    
    const chmod = new remote.Command("Chmod" + agent_name, {
        connection,
        create: "chmod +x ./set-ip.sh",
    }, { dependsOn: copyFile })

    const setStatic = new remote.Command("SetStatic" + agent_name, {
        connection,
        create: "sudo sh ./set-ip.sh " + agent_name + " " + ip,
        environment: {
            hostname: agent_name,
            ip: ip,
        }
    }, { dependsOn: chmod })
}
