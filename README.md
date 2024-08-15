## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Setting Up env
- Copy the `.env-example` to `.env`
- Adjust the value for the config

## Run Migration
```bash
# Generate new Migration File
$ npm run typeorm:migration:generate MIGRATION_FILE_NAME

# Run the migration file
$ npm run typeorm:migration:run
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```