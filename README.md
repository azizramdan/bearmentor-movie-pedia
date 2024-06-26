# MoviePedia REST API

MoviePedia REST API is a web service that provides access to a vast collection of movie data. It allows users to search for movies, retrieve movie details, and perform various operations related to movies.

## Tech Stack

- [Hono](https://hono.dev/) over [Bun](https://bun.sh/) runtime
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)

## API Specification

The OpenAPI Specification for the MoviePedia API offers a detailed description of the API's services. It can be accessed at the path `/api-spec`.

For a more interactive experience, you can use SwaggerUI. It provides a user-friendly interface for exploring and testing the API. You can access SwaggerUI at `/api`.

You can also access the following:

- OpenAPI Specification: https://bearmentor-moviepedia.azizramdan.id/api-spec
- SwaggerUI: https://bearmentor-moviepedia.azizramdan.id/api

## Database Design

To view the database design in more detail, you can navigate to the following link: [ERD](https://dbdiagram.io/d/bearmentor-moviepedia-664f6093f84ecd1d22faab40)

![ERD](./assets/erd.svg)

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

## Running with Docker

To run the application using Docker, follow these steps:

Set up `.env` by copying from `.env.example` for reference

```sh
cp .env.example .env
```

Build the docker images

```sh
docker compose build
```

Run the containers

```sh
docker compose up -d
```

Perform the database migration

```sh
docker compose exec app bun run db:migrate
```

Now you can access the application by opening your browser and navigating to http://localhost:3000.

Alternatively, you can use the pre-built Docker image available on Docker Hub:

```sh
docker pull azizramdan/bearmentor-moviepedia-app
```

For more information, visit the Docker Hub repository: [azizramdan/bearmentor-moviepedia-app](https://hub.docker.com/r/azizramdan/bearmentor-moviepedia-app).

## License

This project is licensed under the [MIT License](LICENSE).
