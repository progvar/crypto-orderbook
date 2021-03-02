import { Injectable } from '@angular/core';
import { filter, map, pluck } from 'rxjs/operators'
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './services/api/api.service';
import { Delta, DeltasToOrderbookMapper, Orderbook } from './models/models';

@Injectable({
    providedIn: 'root',
})
export class OrderbookService {
    private asks: Orderbook = new Map();
    private bids: Orderbook = new Map();
    private asks$: BehaviorSubject<Orderbook> = new BehaviorSubject(this.asks);
    private bids$: BehaviorSubject<Orderbook> = new BehaviorSubject(this.bids);
    
    constructor(private apiService: ApiService) {
        this.apiService.getMessages$().pipe(
            pluck('asks'),
            filter(asks => !!(asks)),
            map(this.updateOrderbook(this.asks)),
        ).subscribe(this.asks$);

        this.apiService.getMessages$().pipe(
            pluck('bids'),
            filter(bids => !!(bids)),
            map(this.updateOrderbook(this.bids)),
        ).subscribe(this.bids$);
    }
    
    private updateOrderbook(orderbook: Orderbook): DeltasToOrderbookMapper {
        return (deltas: Delta[]) => new Map(deltas.reduce(this.processDelta, orderbook));
    }

    private processDelta(orderbook: Orderbook, delta: Delta): Orderbook {
        const levelPrice = delta[0];
        const levelSize = delta[1];
        const isExistingLevel = orderbook.has(levelPrice);
        const isSizeZeroOrNull = levelSize === 0 || levelSize == null;

        if (isExistingLevel && isSizeZeroOrNull) {
            orderbook.delete(levelPrice);

            return orderbook;
        }

        if (!isExistingLevel) {
            return isSizeZeroOrNull
            ? orderbook
            : orderbook.set(levelPrice, { size: levelSize, total: levelSize });
        }

        const currentTotal = orderbook.get(levelPrice)?.total ?? 0;
        const updatedLevelTotal = currentTotal + levelSize;

        return orderbook.set(levelPrice, { size: levelSize, total: updatedLevelTotal });
    }

    getAsks$(): Observable<Orderbook> {
        return this.asks$.asObservable();
    }

    getBids$(): Observable<Orderbook> {
        return this.bids$.asObservable();
    }
}
