package com.naoido.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class QrCodeRegisterPostDto {
    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("qrcode_content")
    private String qrcodeContent;

    @JsonProperty("qrcode_url")
    private String qrcodeUrl;

    @JsonProperty("qrcode_name")
    private String qrcodeName;

    @JsonProperty("qrcode_id")
    private String qrcodeId;

    public QrCodeRegisterPostDto(String userId, String qrcodeContent, String qrcodeName, String qrcodeId, String qrcodeUrl) {
        this.userId = userId;
        this.qrcodeContent = qrcodeContent;
        this.qrcodeName = qrcodeName;
        this.qrcodeId = qrcodeId;
        this.qrcodeUrl = qrcodeUrl;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getQrcodeContent() {
        return qrcodeContent;
    }

    public void setQrcodeContent(String qrcodeContent) {
        this.qrcodeContent = qrcodeContent;
    }

    public String getQrcodeName() {
        return qrcodeName;
    }

    public void setQrcodeName(String qrcodeName) {
        this.qrcodeName = qrcodeName;
    }

    public String getQrcodeId() {
        return qrcodeId;
    }

    public void setQrcodeId(String qrcodeId) {
        this.qrcodeId = qrcodeId;
    }

    public String getQrcodeUrl() {
        return qrcodeUrl;
    }

    public void setQrcodeUrl(String qrcodeUrl) {
        this.qrcodeUrl = qrcodeUrl;
    }
}
