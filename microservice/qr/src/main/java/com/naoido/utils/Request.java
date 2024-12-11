package com.naoido.utils;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class Request {
    public static Response get(String endpoint, Map<String, String> query) throws IOException {
        URL url = new URL(buildUrlWithParams(endpoint, query));
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        connection.setRequestMethod("GET");
        connection.setRequestProperty("Accept", "application/json");

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

    public static String buildUrlWithParams(String baseUrl, Map<String, String> params) {
        StringBuilder urlBuilder = new StringBuilder(baseUrl);
        if (!params.isEmpty()) {
            urlBuilder.append("?");
            params.forEach((key, value) -> {
                try {
                    urlBuilder.append(URLEncoder.encode(key, StandardCharsets.UTF_8))
                            .append("=")
                            .append(URLEncoder.encode(value, StandardCharsets.UTF_8))
                            .append("&");
                } catch (Exception e) {
                    throw new RuntimeException("Error encoding URL parameter: " + key + "=" + value, e);
                }
            });
            urlBuilder.setLength(urlBuilder.length() - 1);
        }
        return urlBuilder.toString();
    }

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
