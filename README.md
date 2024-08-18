## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Functionality
### Authentication

#### Register
**Endpoint:** `POST /auth/register`
**Description:** Register a new user in the system.

#### Login
**Endpoint:** `POST /auth/login`
**Description:** Authenticate a user and obtain an access token.

### Watch Catalog
#### Create Watch Catalog Entry
**Endpoint:** `POST /watches`
**Description:** Create a new watch catalog entry.

#### List Watches
**Endpoint:** `GET /watches`
**Description:** Retrieve a paginated list of watches.
**Query Parameters:**

- `filter` (optional): Filter by watch name or reference number
- `brand` (optional): Filter by brand name
- `page` (optional): Page number for pagination
- `limit` (optional): Number of records per page

#### Get Watch Details
**Endpoint:** `GET /watches/{id}`
**Description:** Retrieve detailed information about a specific watch.

#### Update Watch Catalog Entry
**Endpoint:** `PUT /watches/{id}`
**Description:** Update details of a specific watch catalog entry.

#### Delete Watch Catalog Entry
**Endpoint:** `DELETE /watches/{id}`
**Description:** Delete a specific watch catalog entry.

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

## Test
```bash
$ npm run test
```

## Swagger Documentation
```
http://<base-url>/swagger
```