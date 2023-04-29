# Upstash Redis Local

This repostiroy contains a contrived implementation of
[Upstash Redis](https://docs.upstash.com/redis/features/restapi) HTTP API. It is
intended for local development and testing **only**, should **should not** be
used in production or production-like environments.

## Usage

To use Upstash Redis Local, include it in your `docker-compose.yml` file:

```yaml
#...

services:
  #...
  # Planetscale local
  planetscale:
    image: cloudmix/upstash-redislocal:latest
    container_name: planetscale_local
    hostname: upstash-redislocal
    ports:
      - 3000:8080
    environment:
      - REDIS_URL=redis://redis:6379
      - PORT=8080
  # Redis
  redis:
    image: redis:6.2.6
    container_name: cloudmix_redis
    hostname: redis
    command: redis-server --save 60 1 --loglevel warning
#...
```

The container expects a `REDIS__URL` environment variable to be set. This can be
any Redis connection URL. You can also optionally set the `PORT` environment
variable to set the port the server will listen on. The default is `8080`.
