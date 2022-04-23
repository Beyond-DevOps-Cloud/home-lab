import pulumi
from pulumi import Output
from pulumi_random.random_password import RandomPassword
from pulumi_kubernetes.core.v1 import Namespace, Service
from pulumi_kubernetes.helm.v3 import Release, ReleaseArgs, RepositoryOptsArgs

namespace = Namespace("whatsfordinner")

db_password = RandomPassword("pass", length=10)

release_args = ReleaseArgs(
    chart="SQL Express Database",
    repository_opts=RepositoryOptsArgs(
        repo="https://raw.githubusercontent.com/lordmuffin/whatsfordinner-helm-charts/repo/"
    ),
    version="0.1.0",
    namespace=namespace.metadata["name"],

    # Values from Chart's parameters specified hierarchically,
    # see https://artifacthub.io/packages/helm/bitnami/redis/13.0.0#parameters
    # for reference.
    values={},
        # "cluster": {
        #     "enabled": True,
        #     "slaveCount": 3,
        # },
        # "metrics": {
        #     "enabled": True,
        #     "service": {
        #         "annotations": {
        #             "prometheus.io/port": "9127",
        #         }
        #     },
        # },
        # "global": {
        #     "redis": {
        #         "password": redis_password.result,
        #     }
        # },
        # "rbac": {
        #     "create": True,
        # },
    # },
    # By default Release resource will wait till all created resources
    # are available. Set this to true to skip waiting on resources being
    # available.
    skip_await=False)

release = Release("whatsfordinner-db", args=release_args)

# We can lookup resources once the release is installed. The release's
# status field is set once the installation completes, so this, combined
# with `skip_await=False` above, will wait to retrieve the Redis master
# ClusterIP till all resources in the Chart are available.
status = release.status
# srv = Service.get("redis-master-svc",
#                   Output.concat(status.namespace, "/", status.name, "-master"))
# pulumi.export("redisMasterClusterIP", srv.spec.cluster_ip)