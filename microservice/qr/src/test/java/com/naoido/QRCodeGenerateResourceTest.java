package com.naoido;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private static final String SUPABASE_BASE_URL = System.getenv("SUPABASE_BASE_URL");
    private static final String SUPABASE_PUBLIC_API_KEY = System.getenv("SUPABASE_PUBLIC_API_KEY");
    private static final String TEST_USER_EMAIL = System.getenv("TEST_USER_EMAIL");
    private static final String TEST_USER_PASSWORD = System.getenv("TEST_USER_PASSWORD");

    @Test
    void testGenerateQRCode() {
        String token = getJwtToken();
        given()
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + token)
                .when()
                    .post("/qrcode/generate")
                .then()
                    .assertThat().statusCode(200);
    }

    @Test
    void testGenerateQRCodeUnauthorized() {
        String token = "hoge";
        given()
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + token)
                .when().post("/qrcode/generate")
                .then().assertThat().statusCode(401);
    }

    @Test
    void testGenerateQRCodeEmptyToken() {
        given()
                .header("Content-Type", "application/json")
                .when().post("/qrcode/generate")
                .then().assertThat().statusCode(401);
    }

    private String getJwtToken() {
        final String endpoint = SUPABASE_BASE_URL + "/auth/v1/token?grant_type=password";

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost postRequest = new HttpPost(endpoint);

            Map<String, String> data = new HashMap<>();
            data.put("email", TEST_USER_EMAIL);
            data.put("password", TEST_USER_PASSWORD);

            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(data);

            StringEntity entity = new StringEntity(json);
            postRequest.setEntity(entity);

            postRequest.setHeader("Content-Type", "application/json");
            postRequest.setHeader("apiKey", SUPABASE_PUBLIC_API_KEY);

            try (CloseableHttpResponse response = httpClient.execute(postRequest)) {
                System.out.println("Response Code: " + response.getStatusLine().getStatusCode());

                Map<String, Object> responseBody = objectMapper.readValue(
                        response.getEntity().getContent(),
                        new TypeReference<>() {}
                );
                return responseBody.get("access_token").toString();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
