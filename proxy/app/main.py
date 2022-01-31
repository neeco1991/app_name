import uvicorn as uvicorn
from fastapi import FastAPI

from .src.clients import finnhub_client
from .src.models import Search, StockSymbol, Resolution, Candle

app = FastAPI()


@app.get("/search", response_model=Search)
def search(q: str):
    response = finnhub_client.symbol_lookup(q)
    return response


@app.get("/stock/symbol", response_model=list[StockSymbol])
def get_stock_symbol(
    exchange: str,
):
    response = finnhub_client.stock_symbols(exchange=exchange)
    return response


@app.get("/stock/candles", response_model=Candle)
def get_stock_candles(
    symbol: str,
    timestamp_from: int,
    timestamp_to: int,
    resolution: Resolution = Resolution.D,
):
    response = finnhub_client.stock_candles(
        symbol=symbol, resolution=resolution, _from=timestamp_from, to=timestamp_to
    )

    return response


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=7949, log_level="info", reload=True)
