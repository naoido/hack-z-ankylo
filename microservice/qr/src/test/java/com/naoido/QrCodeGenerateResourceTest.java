package com.naoido;

import com.naoido.models.dto.QrCodeGenerateDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;

@QuarkusTest
public class QrCodeGenerateResourceTest {
    @Test
    void testGenerateQrCode() {
        QrCodeGenerateDTO qrCodeGenerateDTO = new QrCodeGenerateDTO(
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
    void testGenerateQrCodeTooMuchContents() {
        QrCodeGenerateDTO qrCodeGenerateDTO = new QrCodeGenerateDTO(
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
    void testGenerateQrCodeNotEnoughContents() {
        QrCodeGenerateDTO qrCodeGenerateDTO = new QrCodeGenerateDTO(
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
