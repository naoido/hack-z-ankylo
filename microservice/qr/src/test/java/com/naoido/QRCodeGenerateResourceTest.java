package com.naoido;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.naoido.dto.QRCodeGenerateDTO;
import com.naoido.resources.QRCodeGenerateResource;
import io.quarkus.test.junit.QuarkusTest;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;

@QuarkusTest
public class QRCodeGenerateResourceTest {
    @Test
    void testGenerateQRCode() {
        QRCodeGenerateDTO qrCodeGenerateDTO = new QRCodeGenerateDTO(
                "https://naoido.com",
                "naoido.com",
                "hoge_user_id"
        );
        given()
                .header("Content-Type", "application/json")
                .body(qrCodeGenerateDTO)
                .when()
                .post("/qrcode/generate")
                .then()
                .assertThat().statusCode(200);
    }

    @Test
    void testGenerateQRCodeTooMuchContents() {
        QRCodeGenerateDTO qrCodeGenerateDTO = new QRCodeGenerateDTO(
                "A".repeat(501),
                "hoge",
                "hoge_user_id"
        );
        given()
                .header("Content-Type", "application/json")
                .body(qrCodeGenerateDTO)
                .when().post("/qrcode/generate")
                .then().assertThat().statusCode(400);
    }

    @Test
    void testGenerateQRCodeNotEnoughContents() {
        QRCodeGenerateDTO qrCodeGenerateDTO = new QRCodeGenerateDTO(
                null,
                "naoido.com",
                "hoge_user_id"
        );
        given()
                .header("Content-Type", "application/json")
                .body(qrCodeGenerateDTO)
                .when().post("/qrcode/generate")
                .then().assertThat().statusCode(400);
    }
}
