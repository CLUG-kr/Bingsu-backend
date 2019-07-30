# Bingsu backend server
This is bingsu backend server

## Installation
do `NODE_ENV=production` before installation if you're in production environment

```
npm i
npm i --only=dev
npx sequelize db:migrate
```

## Usage
Before start, you have to set NODE_ENV environment variable `production` or `development`, and write config file(`/config/dev.json` or `/config/production.json`)

```
npm run start
```

## API
See wiki