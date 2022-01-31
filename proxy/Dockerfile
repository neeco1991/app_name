FROM python:3.10-alpine

RUN mkdir -p /app
WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY ./app /code/app
COPY ./.env /code/.env

EXPOSE 7949

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7949"]
