# MoviePedia REST API

MoviePedia REST API is a web service that provides access to a vast collection of movie data. It allows users to search for movies, retrieve movie details, and perform various operations related to movies.

## API Specification

The OpenAPI Specification for the MoviePedia API offers a detailed description of the API's services. It can be accessed at the path `/api-spec`.

For a more interactive experience, you can use SwaggerUI. It provides a user-friendly interface for exploring and testing the API. You can access SwaggerUI at `/api`.

You can also access the following:

- OpenAPI Specification: https://bearmentor-moviepedia.azizramdan.id/api-spec
- SwaggerUI: https://bearmentor-moviepedia.azizramdan.id/api

## Getting Started

Set up `.env` by copying from `.env.example` for reference

```sh
cp .env.example .env
```

Install dependencies

```sh
bun install
```

Run DB migration

```sh
bun run db:migrate
```

Then you can run

```sh
bun run dev
```

Afterwards, open your browser and navigate to http://localhost:3000 to start exploring the API.
