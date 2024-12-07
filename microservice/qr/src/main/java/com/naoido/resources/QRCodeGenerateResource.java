package com.naoido.resources;

import com.naoido.services.SupabaseAuthService;
import io.quarkus.security.PermissionsAllowed;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/qrcode")
public class QRCodeGenerateResource {

    @POST
    @Path("/generate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response generateQRCode(@Context HttpHeaders httpHeaders) {
        String token = httpHeaders.getHeaderString(HttpHeaders.AUTHORIZATION);
        try {
            String userId = SupabaseAuthService.getUserId(token);

            if (userId == null) {
                return Response.status(Response.Status.UNAUTHORIZED).entity("Missing or invalid Authorization header").build();
            }

            // TODO: QRコードを生成するエンドポイントを叩く

            return Response.status(Response.Status.OK).entity(userId).build();
        } catch (Exception e) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid bearer token").build();
        }
    }
}
