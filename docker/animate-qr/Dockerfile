FROM python:latest
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

COPY ./src /app/src
CMD [ "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]