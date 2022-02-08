from decouple import config


FINHUB_API_KEY = config("FINHUB_API_KEY")

ORIGINS = [
    "http://localhost",
    "http://localhost:7949",
]
