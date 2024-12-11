package com.naoido.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class QrCode {
    @JsonProperty("qrcode_id")
    private String qrcodeId;

    @JsonProperty("qrcode_name")
    private String qrcodeName;

    @JsonProperty("qrcode_content")
    private String qrcodeContent;

    @JsonProperty("user_id")
    private String userId;

    public QrCode(String qrcodeId, String qrcodeName, String qrcodeContent, String userId) {
        this.qrcodeId = qrcodeId;
        this.qrcodeName = qrcodeName;
        this.qrcodeContent = qrcodeContent;
        this.userId = userId;
    }

    public QrCode() {}

    public String getQrcodeId() {
        return qrcodeId;
    }

    public void setQrcodeId(String qrcodeId) {
        this.qrcodeId = qrcodeId;
    }

    public String getQrcodeName() {
        return qrcodeName;
    }

    public void setQrcodeName(String qrcodeName) {
        this.qrcodeName = qrcodeName;
    }

    public String getQrcodeContent() {
        return qrcodeContent;
    }

    public void setQrcodeContent(String qrcodeContent) {
        this.qrcodeContent = qrcodeContent;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
