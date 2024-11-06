## Project setup

```bash
# install all dependencies 
$ npm install

# generate prisma client
$ npx prisma generate
```

## Compile and run the project

```bash
# run docker containers with redis and postgre
$ docker-compose up -d

# run project in watch mode
$ npm run start:dev
```

### Testing

For test you should send GET request on /film endpoint and add title as a query parametr

Some examples of titles:

Chamber Italian
Grosse Wonderful
Airport Pollock
Bright Encounters