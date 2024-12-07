package com.naoido.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class QRCodeGenerateDTO {
    @JsonProperty("content")
    private String content;
    @Size(min = 1, max = 20)
    @NotNull
    @JsonProperty("qrcode_name")
    private String qrcodeName;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getQrcodeName() {
        return qrcodeName;
    }

    public void setQrcodeName(String qrcodeName) {
        this.qrcodeName = qrcodeName;
    }
}
