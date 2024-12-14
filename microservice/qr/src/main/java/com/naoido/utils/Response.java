package com.naoido.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public record Response(String response, int statusCode) {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    public <T> T parse(Class<T> parseClass) throws JsonProcessingException {
        return MAPPER.readValue(this.response, parseClass);
    }

    public <T> T parse(TypeReference<T> parseClass) throws JsonProcessingException {
        return MAPPER.readValue(this.response, parseClass);
    }
}