export class QrCodeRegister {
    readonly qrCodeId: string;
    readonly qrCodeUrl: string;

    constructor(data: { qr_code_id: string, qr_code_url: string }) {
        this.qrCodeId = data.qr_code_id;
        this.qrCodeUrl = data.qr_code_url;
    }
}