FROM bitwalker/alpine-elixir-phoenix:latest

RUN apk add --no-cache build-base openssl-dev git

WORKDIR /app
RUN mix local.hex --force && mix local.rebar --force
COPY . .

RUN mix deps.get

CMD ["mix", "phx.server"]