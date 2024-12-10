package com.naoido;

import com.naoido.models.dto.QrCodeGenerateDto;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;

@QuarkusTest
public class QrCodeGenerateResourceTest {
    @Test
    void testGenerateQrCode() {
        QrCodeGenerateDto qrCodeGenerateDTO = new QrCodeGenerateDto(
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
        QrCodeGenerateDto qrCodeGenerateDTO = new QrCodeGenerateDto(
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
        QrCodeGenerateDto qrCodeGenerateDTO = new QrCodeGenerateDto(
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
