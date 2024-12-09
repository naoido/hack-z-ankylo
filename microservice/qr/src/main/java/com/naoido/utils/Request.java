package com.naoido.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class Request {
    public static Response post(String endpoint, String json) throws IOException {
        URL url = new URL(endpoint);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json; utf-8");
        connection.setRequestProperty("Accept", "application/json");
        connection.setDoOutput(true);

        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = json.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        int statusCode = connection.getResponseCode();
        String response;
        if (statusCode >= 200 && statusCode < 300) {
            response = new String(connection.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } else {
            response = new String(connection.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);;
        }

        return new Response(response, connection.getResponseCode());
    }
}
