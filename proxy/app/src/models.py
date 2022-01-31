from enum import Enum

from pydantic import BaseModel


class Symbol(BaseModel):
    description: str
    symbol: str
    displaySymbol: str
    type: str


class Search(BaseModel):
    count: int
    result: list[Symbol]


class StockSymbol(BaseModel):
    currency: str
    description: str
    displaySymbol: str
    figi: str
    mic: str
    symbol: str
    type: str


class Resolution(str, Enum):
    min1 = "1"
    min5 = "5"
    min15 = "15"
    min30 = "30"
    min60 = "60"
    D = "D"
    W = "W"
    M = "M"


class Candle(BaseModel):
    c: list[float]
    h: list[float]
    l: list[float]
    o: list[float]
    t: list[int]
    v: list[float]
    s: str
