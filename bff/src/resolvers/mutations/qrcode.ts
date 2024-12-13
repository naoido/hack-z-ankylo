import { MutationResolvers, QrCode, QrCodes } from "../../generated/graphql.js";
import { auth } from "../../services/auth_service.js";
import { generate, generateAnimate, qrCodes, usersQrCodes } from "../../services/qrcode_service.js";

const generateQrCode: MutationResolvers["generateQrCode"] = async (_, { content, qrcode_name }, context) => {
    const user = await auth(context);
    if (user == null) return <QrCode> {
        error: "Unauthorized"
    }
    const result = await generate(content, qrcode_name, user.sub);
    return result;
}

const generateAnimateQrCode: MutationResolvers["generateAnimateQrCode"] = async (_, { file, content, user_id}, context) => {
    const user = await auth(context);
    if (user == null) return <QrCode>{
        error: "Unauthorized"
    }

    const error = await generateAnimate(file, user_id, content);
    if (error != null) {
        return <QrCode>{
            error: error
        }
    }

    // TODO: ここにDB登録
    return <QrCode>{ error : "" }
}

const getQrCodes: MutationResolvers["getQrCodes"] = async (_, { page, count, user_id }, context) => {
    const user = await auth(context);
    if (user == null) return <QrCodes>{
        error: "Unauthorized"
    }
    return { qrcodes: await qrCodes(page, count, user_id) };
}

const getUsersQrCodes: MutationResolvers["getUsersQrCodes"] = async (_, { page, count, user_ids }, context) => {
    const user = await auth(context);
    if (user == null) return <QrCodes>{
        error: "Unauthorized"
    }
    return { qrcodes: await usersQrCodes(page, count, user_ids) };
}

export default { generateQrCode, getQrCodes, getUsersQrCodes, generateAnimateQrCode }