
import base64
import os
import uuid
from pathlib import Path
from typing import Union

import boto3
from amzqr import amzqr
from fastapi import FastAPI, File, Form, Request, UploadFile
from fastapi.responses import JSONResponse

app = FastAPI()

R2_ACCESS_KEY = os.environ["R2_ACCESS_KEY"]
R2_SECRET_KEY = os.environ["R2_SECRET_KEY"]
R2_BUCKET_NAME = os.environ["R2_BUCKET_NAME"]
R2_ENDPOINT_URL = os.environ["R2_ENDPOINT"]
IMAGE_BASE_URL = os.environ["IMAGE_BASE_URL"]

TMP_DIR = "/tmp"


@app.get("/healthcheck")
def healthcheck():
    return {"message": "ok"}


@app.post("/generate")
async def generate_qr(request: Request) -> JSONResponse:
    try:
        # JSONデータを読み込む
        body = await request.json()
        content = body.get("content")
        user_id = body.get("user_id")
        qrcode_id = body.get("qrcode_id")
        image_data = body.get("image")
    except:
        JSONResponse(status_code=400, content={"message": "Bad Request"})

    extension = ".png"
    if image_data.startswith("data:image"):
        mime_type = image_data.split(";")[0].split(":")[1]
        extension = f".{mime_type.split("/")[1]}"
        image_data = image_data.split(",")[1]

    image = base64.b64decode(image_data)
    file_name = str(uuid.uuid4()) + extension
    file_path = os.path.join(TMP_DIR, file_name)
    qrcode_tmp = qrcode_id + extension

    with open(file_path, "wb") as f:
            f.write(image)

    amzqr.run(
        content,
        version=1,
        level="H",
        picture=file_path,
        save_name=qrcode_tmp,
        colorized=True,
        save_dir=TMP_DIR
    )
    result = put_to_r2(user_id, qrcode_tmp)
    response = None
    if result:
        response = JSONResponse(status_code=200, content={"message": "success!", "qrcode_url": f"{IMAGE_BASE_URL}/{user_id}/{qrcode_tmp}"})
    else:
        response = JSONResponse(status_code=500, content={"message": "Internal Server Error"})

    os.remove(f"{TMP_DIR}/{qrcode_tmp}")
    os.remove(f"{TMP_DIR}/{file_name}")

    return response


def put_to_r2(user_id, key: str) -> bool:
    try:
        s3_client = boto3.client(
            "s3",
            endpoint_url=R2_ENDPOINT_URL,
            aws_access_key_id=R2_ACCESS_KEY,
            aws_secret_access_key=R2_SECRET_KEY,
        )
        s3_client.upload_file(f"{TMP_DIR}/{key}", R2_BUCKET_NAME, f"{user_id}/{key}")

        return True
    except Exception as e:
        print(e)
        return False