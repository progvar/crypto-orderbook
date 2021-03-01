import { Injectable } from '@angular/core';
import { filter, map, switchMap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Ask, Bid, Delta, Orderbook, Orders } from '../../models/models';

@Injectable({
    providedIn: 'root',
})
export class OrderbookService {
    private asks: Orderbook = new Map();
    private bids: Orderbook = new Map();
    private asks$: Observable<Orderbook> = this.apiService.getOrders$().pipe(
        switchMap((orders: Orders) => of(orders.asks)),
        filter((asks: Ask[]) => asks.length !== 0),
        map(this.updateOrderbook(this.asks)),
    );
    private bids$: Observable<Orderbook> = this.apiService.getOrders$().pipe(
        switchMap((orders: Orders) => of(orders.bids)),
        filter((bids: Bid[]) => bids.length !== 0),
        map(this.updateOrderbook(this.bids)),
    );
    
    constructor(private apiService: ApiService) {}
    
    updateOrderbook(orderbook: Orderbook) {   
        return (deltas: Delta[]) => deltas.reduce(this.processDelta, orderbook)
    }

    processDelta(orderbook: Orderbook, curr: Delta) {
        const levelPrice = curr[0];
        const levelSize = curr[1];
        const isExistingLevel = orderbook.has(levelPrice);

        if (levelSize === 0 && isExistingLevel) {
            orderbook.delete(levelPrice);

            return orderbook;
        }

        if (!isExistingLevel && levelSize !== 0) {
            return orderbook.set(levelPrice, { size: levelSize, total: levelSize })
        }

        if (!isExistingLevel && levelSize === 0) {
            return orderbook;
        }

        const updatedLevelTotal = orderbook.get(levelPrice)?.total ?? 0 + levelSize;

        return orderbook.set(levelPrice, { size: levelSize, total: updatedLevelTotal });
    }

    getBids$() {
        return this.bids$;
    }

    getAsks$() {
        return this.asks$;
    }
}
