import finnhub

from .settings import FINHUB_API_KEY

finnhub_client = finnhub.Client(api_key=FINHUB_API_KEY)
