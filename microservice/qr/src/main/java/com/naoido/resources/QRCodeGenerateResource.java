package com.naoido.resources;

import com.naoido.services.QRCodeService;
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

import java.util.HashMap;
import java.util.Map;

@Path("/qrcode")
public class QRCodeGenerateResource {

    @POST
    @Path("/generate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response generateQRCode(@Context HttpHeaders httpHeaders) {
        Map<String, Object> result = new HashMap<>();
        String token = httpHeaders.getHeaderString(HttpHeaders.AUTHORIZATION);
        try {
            String userId = SupabaseAuthService.getUserId(token);

            if (userId == null) {
                result.put("message", "Missing or invalid Authorization token");
                return Response.status(Response.Status.BAD_REQUEST).entity(result).build();
            }

            // TODO: QRコードを生成するエンドポイントを叩く
            String qrcode = QRCodeService.generateQRCodeAsBase64("https://naoido.com");
            result.put("qrcode", qrcode);

            return Response.status(Response.Status.OK).entity(result).build();
        } catch (Exception e) {
            result.put("message", "Invalid Authorization token");
            return Response.status(Response.Status.UNAUTHORIZED).entity(result).build();
        }
    }
}
