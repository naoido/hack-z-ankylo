package com.naoido.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.naoido.utils.StackTrace;

public class ErrorResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("stack_trace")
    private String stackTrace;

    public ErrorResponse(String message, Exception e) {
        this.message = message;
        this.stackTrace = StackTrace.getStackTrace(e);
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStackTrace() {
        return stackTrace;
    }

    public void setStackTrace(String stackTrace) {
        this.stackTrace = stackTrace;
    }
}
