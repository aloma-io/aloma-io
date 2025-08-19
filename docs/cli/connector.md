## Manage connectors

Usage:
```bash
  aloma connector [options] [command]
```

Options:
```bash
-h, --help                   display help for command`
```

Commands:
```bash
list [options]               List all connectors
list-available [options]     List all available connector types and their configurations
show [options] <id>          Show connector details
add [options] <connectorId>  Add a new connector
delete [options] <id>        Delete a connector
update [options] <id>        Update a connector
logs [options] <id>          View logs for a connector
oauth [options] <id>         Start OAuth process for a connector
help [command]               display help for command
```

Example
```bash
aloma connector list # list connectors added into the workspace
aloma connector list-available -f sheet # list of connectors that can be installed filter by name optional
aloma connector list-available # list without filter
aloma conector show n7c0g49xpazlv9ce1m1pz70lh0p1pwyl # to see the details of one installed connector
aloma connector oauth n7c0g49xpazlv9ce1m1pz70lh0p1pwyl # to start the oauth
aloma connector logs n7c0g49xpazlv9ce1m1pz70lh0p1pwyl # to see the logs of one connector
aloma connector delete gurofxm3mjadu4whgtqw1hy66upw0z70 # to remove one fom the workspace
aloma connector update gurofxm3mjadu4whgtqw1hy66upw0z70 -f ./examples/connector/connector-config.json # update using a json file
aloma connector update wqd4kf1fuqe9k9s5zrxec6igexhu7g8f -n newName -ns NewNS -s true -t 't1,t2' # update using options
aloma connector add w3a1oc32mky6rlpbqwzq1f6opc37z1hs -n sheet # add with specific name
```
