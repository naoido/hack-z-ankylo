package com.naoido.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class QrCodeGenerateResponse {
    @JsonProperty("qrcode_id")
    private String qrCodeId;

    @JsonProperty("qrcode_url")
    private String qrCodeUrl;

    public QrCodeGenerateResponse(String qrCodeId, String qrCodeUrl) {
        this.qrCodeId = qrCodeId;
        this.qrCodeUrl = qrCodeUrl;
    }

    public String getQrCodeId() {
        return qrCodeId;
    }

    public void setQrCodeId(String qrCodeId) {
        this.qrCodeId = qrCodeId;
    }

    public String getQrCodeUrl() {
        return qrCodeUrl;
    }

    public void setQrCodeUrl(String qrCodeUrl) {
        this.qrCodeUrl = qrCodeUrl;
    }
}
