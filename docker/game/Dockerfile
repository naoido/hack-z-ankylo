FROM bitwalker/alpine-elixir-phoenix:latest

WORKDIR /app
COPY ./game /app
COPY ./game/mix.exs /app/mix.exs

RUN mix do deps.get, deps.compile

CMD ["mix", "phx.server"]