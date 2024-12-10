import { MutationResolvers, QrCode } from "../../generated/graphql.js";
import { auth } from "../../services/auth_service.js";
import { generate } from "../../services/qrcode_service.js";

const generateQrCode: MutationResolvers["generateQrCode"] = async (_, { content, qrcode_name }, context) => {
    const user = await auth(context);
    if (user == null) return <QrCode> {
        error: "Unauthorized"
    }
    const result = await generate(content, qrcode_name, user.sub);
    return result;
}

export default { generateQrCode }