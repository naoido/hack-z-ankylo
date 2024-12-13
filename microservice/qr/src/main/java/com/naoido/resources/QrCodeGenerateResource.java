package com.naoido.resources;

import com.naoido.models.dto.ErrorResponse;
import com.naoido.models.dto.QrCode;
import com.naoido.models.dto.QrCodeGenerateDto;
import com.naoido.models.dto.QrCodeGenerateResponse;
import com.naoido.services.QrCodeService;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.IOException;
import java.util.List;

import static com.naoido.services.QrCodeService.getImageUrl;

@Path("/qrcode")
public class QrCodeGenerateResource {

    @POST
    @Path("/generate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response generateQrCode(@Valid QrCodeGenerateDto qrCodeGenerateDTO) {
        try {
            String qrcode = QrCodeService.generateAndSave(qrCodeGenerateDTO);
            QrCodeGenerateResponse response = new QrCodeGenerateResponse(qrcode, getImageUrl(qrCodeGenerateDTO.getUserId(), qrcode));

            return Response.status(Response.Status.OK).entity(response).build();
        } catch (Exception e) {
            ErrorResponse response = new ErrorResponse("Failed to generate QR Code", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
    }

    @GET
    @Path("/list/user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getQrCodeList(@QueryParam("user_id") String userId, @QueryParam("page") int page, @QueryParam("count") int count) {
        try {
            List<QrCode> result = QrCodeService.getQrCodes(userId, page, count);
            if (result == null || result.isEmpty()) return Response.status(Response.Status.NOT_FOUND).build();

            return Response.status(Response.Status.OK).entity(result).build();
        } catch (IOException e) {
            ErrorResponse response = new ErrorResponse("Internal Server Error", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
    }

    @GET
    @Path("/list/users")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserQrCodeList(@QueryParam("user_ids") String userIds, @QueryParam("page") int page, @QueryParam("count") int count) {
        try {
            List<QrCode> result = QrCodeService.getUsersQrCodes(userIds, page, count);
            if (result == null || result.isEmpty()) return Response.status(Response.Status.NOT_FOUND).build();

            return Response.status(Response.Status.OK).entity(result).build();
        } catch (IOException e) {
            ErrorResponse response = new ErrorResponse("Internal Server Error", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
    }
}
