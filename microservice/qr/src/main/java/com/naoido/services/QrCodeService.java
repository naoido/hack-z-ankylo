package com.naoido.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
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
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class QrCodeService {
    private static final String R2_ENDPOINT = System.getenv("R2_ENDPOINT");
    private static final String R2_ACCESS_KEY = System.getenv("R2_ACCESS_KEY");
    private static final String R2_SECRET_KEY = System.getenv("R2_SECRET_KEY");
    private static final String R2_BUCKET_NAME = System.getenv("R2_BUCKET_NAME");
    private static final String QRCODE_ENCODING = "UTF-8";
    private static final int QRCODE_SIZE = 500;

    static public String generateAndSave(String userId, String content) throws IOException, WriterException {
        String qrcodeId = UUID.randomUUID().toString();
        byte[] image = generateQRCode(content);

        boolean result = saveToR2(image, userId, qrcodeId);
        if (!result) {
            throw new WriterException("Could not save QR Code");
        }

        return qrcodeId;
    }

    static private byte[] generateQRCode(String content) throws WriterException, IOException {
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

    static private boolean saveToR2(byte[] imageBytes, String userId, String qrcodeId) {
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
