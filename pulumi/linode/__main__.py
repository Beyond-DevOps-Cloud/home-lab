"""A Linode Python Pulumi program"""

import pulumi
import pulumi_linode as linode

version = "1.22"
label = "home-lab"
instance_count = 1
instance_type = "g6-standard-1"
region = "us-central"
tags = ["home-lab"]

cluster = linode.LkeCluster(label,
    k8s_version=version,
    label=label,
    pools=[linode.LkeClusterPoolArgs(
        count=instance_count,
        type=instance_type,
    )],
    region=region,
    tags=tags)

# Export the Instance label of the instance
pulumi.export('cluster_label', cluster.label)
