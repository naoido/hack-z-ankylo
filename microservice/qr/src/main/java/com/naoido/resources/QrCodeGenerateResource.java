package com.naoido.resources;

import com.naoido.models.dto.QrCodeGenerateDTO;
import com.naoido.services.QrCodeService;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.HashMap;
import java.util.Map;

@Path("/qrcode")
public class QrCodeGenerateResource {

    @POST
    @Path("/generate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response generateQrCode(@Valid QrCodeGenerateDTO qrCodeGenerateDTO) {
        Map<String, Object> result = new HashMap<>();
        try {
            String qrcode = QrCodeService.generateAndSave(qrCodeGenerateDTO);
            result.put("qrcode", qrcode);
            result.put("status", "success");

            return Response.status(Response.Status.OK).entity(result).build();
        } catch (Exception e) {
            e.printStackTrace();
            result.put("message", "Failed to generate QR Code");
            return Response.status(Response.Status.BAD_REQUEST).entity(result).build();
        }
    }
}
