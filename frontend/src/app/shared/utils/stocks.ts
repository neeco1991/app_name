export const splitSymbol = (
  symbol: string
): [ticker: string, exchange: string] => {
  const splitted = symbol.split('.');
  const ticker = splitted[0];
  const exchange = splitted.length > 1 ? splitted[1] : 'USA';
  return [ticker, exchange];
};
