package com.naoido.resources;

import com.beust.jcommander.Parameter;
import com.naoido.dto.QRCodeGenerateDTO;
import com.naoido.services.QRCodeService;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.annotations.Param;

import java.util.HashMap;
import java.util.Map;

@Path("/qrcode")
public class QRCodeGenerateResource {

    @POST
    @Path("/generate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response generateQRCode(@Valid QRCodeGenerateDTO qrCodeGenerateDTO) {
        Map<String, Object> result = new HashMap<>();
        try {
            String qrcode = QRCodeService.generateQRCodeAsBase64(qrCodeGenerateDTO.getContent());
            result.put("qrcode", qrcode);
            result.put("status", "success");

            return Response.status(Response.Status.OK).entity(result).build();
        } catch (Exception e) {
            result.put("message", "Failed to generate QR Code");
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(result).build();
        }
    }
}
