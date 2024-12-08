package com.naoido.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.naoido.services.JwtTokenService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/token")
public class JwtTokenResource {
    @POST
    @Path("/validate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateToken(@Context HttpHeaders httpHeaders) {
        String token = httpHeaders.getHeaderString(HttpHeaders.AUTHORIZATION);
        JwtTokenService jwtTokenService = new JwtTokenService(token);

        try {
            if (!jwtTokenService.isValidToken()) {
                return Response.status(Response.Status.UNAUTHORIZED).build();
            }

            return Response.ok(jwtTokenService.getPayload()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }
}
