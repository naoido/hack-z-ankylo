package com.naoido.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.naoido.models.enums.Endpoints;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class QrCodeGenerateDto {
    @Size(min = 1, max = 500)
    @NotNull
    @JsonProperty("content")
    private String content;

    @Size(min = 1, max = 20)
    @NotNull
    @JsonProperty("qrcode_name")
    private String qrcodeName;

    @NotNull
    @JsonProperty("user_id")
    private String userId;

    public QrCodeGenerateDto(String content, String qrcodeName, String userId) {
        this.content = content;
        this.qrcodeName = qrcodeName;
        this.userId = userId;
    }

    public String getImageUrl(String qrcodeId) {
        return Endpoints.IMAGE_BASE_URL + "/" + this.userId + "/" + qrcodeId;
    }

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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
