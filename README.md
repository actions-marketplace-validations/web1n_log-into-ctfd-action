# log-into-ctfd-action

GitHub Action to log into CTFd site

## Inputs

### address

Server address of CTFd, sample: https://example.com

### username

Username used to log into CTFd

### password

Password used to log into CTFd

### logout

Log out from CTFd at the end of a job, default is true

## Outputs

### user_id

User id

### user_name:

User name

### user_email

User email address

### session

Cookie session id

### nonce

Csrf nonce

## Example

```yaml
name: Login into example CTFd site
on: [ workflow_dispatch ]

jobs:
  login:
    runs-on: ubuntu-latest
    steps:
      - name: Login into CTFd
        id: login
        uses: web1n/log-into-ctfd-action@main
        with:
          address: https://example.com
          username: web1n
          password: 123456
      - name: Output user info
        run: |
          echo ${{ steps.login.outputs.user_name }}
          echo ${{ steps.login.outputs.user_email }}
```
