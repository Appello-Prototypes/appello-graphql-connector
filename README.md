# Appello GraphQL Client

This is a simple client for the Appello GraphQL API.

## Prerequisites

- [bun](https://bun.sh/)

## Getting Started

1. Clone the repository
2. Run `bun install`
3. Create a `.env` file with the following variables:
    - `API_BASE_URL`
    - `API_KEY`
    - `API_SECRET`
    - `API_USERNAME`
    - `API_PASSWORD`
4. Run `bun run start`

## Usage

```bash
bun run start
```

## Authentication Documentation

1. Get an Application Key and Secret from Appello
2. Get an API Username and Password from Appello
3. Make a HTTP POST request to the `/authenticate` endpoint with the Application Key and Secret to Obtain an `Authorization Token`
4. Make a GRAPHQL Query to `authenticateUser` with the `Authorization Token` and the API Username and Password to Obtain a `User Application Token`
5. Use the `User Application Token` to make GraphQL queries to the Appello API
