# Manage tasks

Usage: 
```bash
aloma task [options] [command]`
```

Options:
```bash
-h, --help            display help for command`
```

Commands:
```bash
list [options]        List all tasks
log <id>              Log task details
new [options] <name>  Create a new task
clone <id>            Clone a task
stop <id>             Stop a task
resume <id>           Resume a task
help [command]        display help for command`
```

Examples
```bash
# List all tasks (no filtering)
aloma task list

# Filter by state
aloma task list --state done
aloma task list --state error

# Filter by name
aloma task list --name "my-task"

# Combine filters
aloma task list --state done --name "my-task"

# With workspace specification
aloma task list --workspace <workspace-id> --state attention
aloma task new test -d '{"test":true}'
aloma task new testf -f ./examples/task/task1.json

# clean log of every step
aloma task log task-psgsq7exu5fwl43u5t605qian44884g0

# show the changes in every step
aloma task log task-psgsq7exu5fwl43u5t605qian44884g0 --changes

# show console and audit logs in every step
aloma task log task-psgsq7exu5fwl43u5t605qian44884g0 --logs

# show the changes and logs just in step 1
aloma task log task-psgsq7exu5fwl43u5t605qian44884g0 --changes --logs --step 1
```
