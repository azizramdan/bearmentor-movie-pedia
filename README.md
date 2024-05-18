# MoviePedia API

Explore a world of cinematic insights with ease using the **MoviePedia API**. Access comprehensive movie data for seamless exploration and discovery.

## REST API Endpoints

Base API URL: https://bearmentor-movie-pedia.azizramdan.id/api

| Endpoint      | HTTP     | Description        |
| ------------- | -------- | ------------------ |
| `/movies`     | `GET`    | Get all movies     |
| `/movies/:id` | `GET`    | Get movie by id    |
| `/movies`     | `POST`   | Add new movie      |
| `/movies`     | `DELETE` | Delete all movies  |
| `/movies/:id` | `DELETE` | Delete movie by id |
| `/movies/:id` | `PUT`    | Update movie by id |

## Getting Started

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3000
