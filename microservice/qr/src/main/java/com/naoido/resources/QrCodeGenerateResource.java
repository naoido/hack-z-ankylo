package com.naoido.resources;

import com.naoido.models.dto.ErrorResponse;
import com.naoido.models.dto.QrCodeGenerateDto;
import com.naoido.models.dto.QrCodeGenerateResponse;
import com.naoido.services.QrCodeService;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/qrcode")
public class QrCodeGenerateResource {

    @POST
    @Path("/generate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response generateQrCode(@Valid QrCodeGenerateDto qrCodeGenerateDTO) {
        try {
            String qrcode = QrCodeService.generateAndSave(qrCodeGenerateDTO);
            QrCodeGenerateResponse response = new QrCodeGenerateResponse(qrcode, qrCodeGenerateDTO.getImageUrl(qrcode));

            return Response.status(Response.Status.OK).entity(response).build();
        } catch (Exception e) {
            ErrorResponse response = new ErrorResponse("Failed to generate QR Code", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
    }
}
