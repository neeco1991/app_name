from decouple import config


FINHUB_API_KEY = config("FINHUB_API_KEY")

ORIGINS = [
    "http://localhost:4200",
    "http://localhost:7949",
]
