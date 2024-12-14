defmodule GameWeb.ApiController do
  use GameWeb, :controller

  def index(conn, _params) do
    json(conn, %{status: "ok"})
  end

  def creategame(conn, _params) do
    list = for i <- 0..15, do: div(i, 2)
    list = Enum.take_random(list, 16)
    json(conn, %{
      numbers: list
    })
  end

end