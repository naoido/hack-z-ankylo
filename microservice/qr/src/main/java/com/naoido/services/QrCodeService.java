package com.naoido.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.naoido.models.dto.QrCode;
import com.naoido.models.dto.QrCodeGenerateDto;
import com.naoido.models.dto.QrCodeRegisterPostDto;
import com.naoido.models.enums.Endpoints;
import com.naoido.utils.Request;
import com.naoido.utils.Response;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class QrCodeService {
    private static final String R2_ENDPOINT = System.getenv("R2_ENDPOINT");
    private static final String R2_ACCESS_KEY = System.getenv("R2_ACCESS_KEY");
    private static final String R2_SECRET_KEY = System.getenv("R2_SECRET_KEY");
    private static final String R2_BUCKET_NAME = System.getenv("R2_BUCKET_NAME");
    private static final String CLOUDFLARE_API_KEY = System.getenv("CLOUDFLARE_API_KEY");
    private static final String QRCODE_ENCODING = "UTF-8";
    private static final int QRCODE_SIZE = 500;
    private static final ObjectMapper mapper = new ObjectMapper();

    public static String generateAndSave(QrCodeGenerateDto request) throws IOException, WriterException {
        String qrcodeId = UUID.randomUUID().toString();
        byte[] image = generateQRCode(request.getContent());

        boolean result = saveToR2(image, request.getUserId(), qrcodeId);
        if (!result) {
            throw new WriterException("Could not save QR Code to R2");
        }

        int statusCode = registerQrCode(request.getUserId(), request.getContent(), request.getQrcodeName(), qrcodeId);
        if (statusCode != 200) {
            System.out.println();
            throw new WriterException("Could not save QR Code to D1");
        }

        return qrcodeId;
    }

    public static int register(QrCodeGenerateDto qrCodeGenerateDto) throws IOException {
        return registerQrCode(qrCodeGenerateDto.getUserId(), qrCodeGenerateDto.getContent(),
                qrCodeGenerateDto.getQrcodeName(), qrCodeGenerateDto.getQrcodeId());
    }

    public static List<QrCode> getQrCodes(String userId, int page, int count) throws IOException {
        Map<String, String> query = Map.of("user_id", userId, "page", String.valueOf(page), "count", String.valueOf(count));
        Response response = Request.get(Endpoints.CloudflareWorkers.GET_QRCODES.toString(), query, CLOUDFLARE_API_KEY);
        if (response.statusCode() == 404) return null;
        if (response.statusCode() == 500) throw new IOException("Internal server error. Status Code: " + response.statusCode() +
                ", Response Body: " + response.response());

        return response.parse(new TypeReference<List<QrCode>>() {})
                .stream()
                .peek(q -> q.setQrcodeUrl(getImageUrl(q.getUserId(), q.getQrcodeId())))
                .toList();
    }

    public static String getImageUrl(String userId, String qrcodeId) {
        return Endpoints.IMAGE_BASE_URL + "/" + userId + "/" + qrcodeId + ".jpg";
    }

    public static List<QrCode> getUsersQrCodes(String userIds, int page, int count) throws IOException {
        Map<String, String> query = Map.of("user_ids", userIds, "page", String.valueOf(page), "count", String.valueOf(count));
        Response response = Request.get(Endpoints.CloudflareWorkers.GET_USERS_QRCODES.toString(), query, CLOUDFLARE_API_KEY);

        return response.parse(new TypeReference<>() {});
    }

    private static int registerQrCode(String userId, String qrcodeContent, String qrcodeName, String qrcodeId) throws IOException {
        QrCodeRegisterPostDto model = new QrCodeRegisterPostDto(userId, qrcodeContent, qrcodeName, qrcodeId);
        Response response = Request.post(Endpoints.CloudflareWorkers.REGISTER_QRCODE.toString(), mapper.writeValueAsString(model), CLOUDFLARE_API_KEY);

        return response.statusCode();
    }

    private static byte[] generateQRCode(String content) throws WriterException, IOException {
        ConcurrentHashMap<EncodeHintType, Object> hints = new ConcurrentHashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
        hints.put(EncodeHintType.CHARACTER_SET, QRCODE_ENCODING);
        hints.put(EncodeHintType.MARGIN, 0);

        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix bitMatrix = writer.encode(content, BarcodeFormat.QR_CODE, QRCODE_SIZE, QRCODE_SIZE, hints);
        BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "jpeg", byteArrayOutputStream);

        return byteArrayOutputStream.toByteArray();
    }

    private static boolean saveToR2(byte[] imageBytes, String userId, String qrcodeId) {
        try (S3Client s3Client = S3Client.builder()
                .endpointOverride(URI.create(R2_ENDPOINT))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(R2_ACCESS_KEY, R2_SECRET_KEY)))
                .region(Region.of("auto"))
                .build()) {
            String fileName = userId + "/" + qrcodeId + ".jpg";
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(R2_BUCKET_NAME)
                    .key(fileName)
                    .contentType("image/jpeg")
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(imageBytes));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
