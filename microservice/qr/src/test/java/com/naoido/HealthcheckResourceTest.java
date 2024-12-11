package com.naoido;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;

@QuarkusTest
public class HealthcheckResourceTest {
    @Test
    void testHealthCheck() {
        given()
                .when().get("/healthcheck").then().assertThat().statusCode(200);
    }
}
