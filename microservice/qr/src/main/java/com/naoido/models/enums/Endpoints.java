package com.naoido.models.enums;

public enum Endpoints {
    CLOUDFLARE_WORKERS_BASE_URL(System.getenv("CLOUDFLARE_WORKERS_BASE_URL")),
    IMAGE_BASE_URL(System.getenv("IMAGE_BASE_URL"));

    private final String endpoint;

    Endpoints(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getEndpoint() {
        return endpoint;
    }

    @Override
    public String toString() {
        return endpoint;
    }

    public enum CloudflareWorkers {
        REGISTER_QRCODE(CLOUDFLARE_WORKERS_BASE_URL.endpoint + "/api/qrcode/register");

        private final String endpoint;

        CloudflareWorkers(String endpoint) {
            this.endpoint = endpoint;
        }

        @Override
        public String toString() {
            return this.endpoint;
        }

        public String getEndpoint() {
            return this.endpoint;
        }
    }
}
