## API Documentation

### List accounts

```
curl http://localhost:8080/accounts
```

### Create account

```
curl -X POST -d '{"username":"mike.bild", "password": "secret"}' -H 'content-type: application/json' http://localhost:8080/accounts
```
