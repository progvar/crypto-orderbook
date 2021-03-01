export type Delta = [number, number];
export type Bid = Delta;
export type Ask = Delta;
export type Orders = { bids: Bid[]; asks: Ask[]; };
export type OrderSize = number;
export type OrderTotal = number;
export type Orderbook = Map<number, { size: OrderSize; total: OrderTotal }>