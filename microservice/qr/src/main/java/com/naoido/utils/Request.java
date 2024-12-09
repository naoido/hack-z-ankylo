package com.naoido.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class Request {
    public static Response post(String endpoint, String json) throws IOException {
        URL url = new URL(endpoint);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json; charset=" + StandardCharsets.UTF_8);
        connection.setRequestProperty("Accept", "application/json");
        connection.setDoOutput(true);

        OutputStreamWriter output = new OutputStreamWriter(connection.getOutputStream());
        output.write(json);
        output.flush();
        output.close();
        connection.connect();

        int statusCode = connection.getResponseCode();
        String response;
        if (200 <= statusCode && statusCode < 300) {
            response = new String(connection.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } else {
            response = new String(connection.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);;
        }

        return new Response(response, statusCode);
    }
}
