### STEP

**Manage steps**

Usage: 
```bash
aloma step [options] [command]`
```

Options:
```bash
-h, --help             display help for command`
```

Commands:
```bash
list [options]         List all steps
show [options] <id>    Show step details
add [options] <name>   Add a new step
delete [options] <id>  Delete a step
edit [options] <id>    Edit a step
clone [options] <id>   Clone a step
pull [options]         Pull steps from workspace to local files
sync [options]         Sync local step files to workspace
help [command]         display help for command`
```

Examples
```bash
# Pull all steps from current workspace
aloma step pull

# Pull all steps to custom path
aloma step pull -p ./.aloma
 
# Pull specific step to custom path
aloma step pull -s step-123 -p /path/to/steps

# Sync all steps from current directory
aloma step sync

# Sync specific step from custom path
aloma step sync -s step-123 -p /path/to/steps
```
