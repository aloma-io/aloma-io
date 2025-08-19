# **WORKSPACE**

### Manage Workspace CLI

Command:

```bash
aloma workspace [options] [command]
```

Options:
```bash
-h, --help                     display help for command
```

Commands:
```bash
list [options]                 List all automation workspaces
show [options]                 Show current workspace
switch <identifier>            Switch to a different workspace by name or ID
add [options] <name>           Create a new workspace
delete [options] [workspace]   Delete a workspace or cancel deletion
archive [options] [workspace]  Archive or unarchive a workspace
update [options] [workspace]   Update workspace settings
source [options]               Edit the source configuration for the workspace
sync [options]                 Trigger source sync for the workspace
help [command]                 display help for command
```

**EXAMPLES**
```bash
aloma workspace delete
aloma workspace delete --cancel
```

Archive a workspace:
aloma workspace archive [workspace]

Unarchive:
```bash
aloma workspace archive [workspace] --unarchive
```

Update workspace settings:
```bash
aloma workspace update [workspace] --name "New Name" --tags "tag1,tag2" --health-enabled true --notification-groups "group1,group2"
aloma workspace update --name "JJTesting" --notification-groups ""
aloma workspace update --tags ""
```

Source - git
```bash
aloma workspace source --file examples/source/source-config.json
aloma workspace show -sc # show the workspace source config
aloma workspace source --branch other_company #to edit just one field
aloma workspace sync #to sync step from github
```
