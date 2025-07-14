## Manage users

Usage: 
```bash
aloma user [options] [command]
```

Options:
```bash
-h, --help                 display help for command
```

Commands:
```bash
list                       List all users in the current company
invite [options] <emails>  Invite a new user to the current company
update [options] <id>      Update a user
remove <id>                Remove a user from the current company
help [command]             display help for command
```

Example
```bash
aloma user list
aloma user invite jurmanos@gmail.com -r developer,admin,bussines
aloma user update e88668d6-1ddc-445a-bad6-d84497888e53 -r developer,admin
aloma user remove e88668d6-1ddc-445a-bad6-d84497888e53
```
