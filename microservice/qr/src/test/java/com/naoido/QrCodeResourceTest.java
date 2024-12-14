package com.naoido;

import com.naoido.models.dto.QrCodeGenerateDto;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;

@QuarkusTest
public class QrCodeResourceTest {
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

    @Test
    void testGetQrCodes() {
        given()
                .queryParams(Map.of("user_id", "12345678-e29b-41d4-a716-123456789000", "page", "1", "count", "1"))
                .when().get("/qrcode/list/user")
                .then().assertThat().statusCode(200);
    }

    @Test
    void testGetQrCodesNotfound() {
        given()
                .queryParams(Map.of("user_id", "empty_user", "page", "1", "count", "1"))
                .when().get("/qrcode/list/user")
                .then().assertThat().statusCode(404);
    }

    @Test
    void testUsersGetQrCodes() {
        given()
                .queryParams(Map.of("user_ids", "12345678-e29b-41d4-a716-123456789000", "page", "1", "count", "1"))
                .when().get("/qrcode/list/users")
                .then().assertThat().statusCode(200);
    }

    @Test
    void testUsersGetQrCodesNotfound() {
        given()
                .queryParams(Map.of("user_ids", "empty_user", "page", "1", "count", "1"))
                .when().get("/qrcode/list/users")
                .then().assertThat().statusCode(404);
    }
}
