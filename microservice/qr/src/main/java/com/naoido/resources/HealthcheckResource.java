package com.naoido.resources;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/healthcheck")
public class HealthcheckResource {
    @GET
    public String healthcheck() {
        return "OK";
    }
}
