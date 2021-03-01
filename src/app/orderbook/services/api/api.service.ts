import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { map } from 'rxjs/operators'
import { BehaviorSubject, Observable } from 'rxjs';
import { Orders } from '../../models/models';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private orders$: BehaviorSubject<Orders> = new BehaviorSubject({ bids: [], asks: [] } as Orders);
    
    constructor() {
        const wsSubject = webSocket<any>('wss://www.cryptofacilities.com/ws/v1');
        
        wsSubject.next({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD']
        });

        wsSubject.pipe(
            map(({ bids = [], asks = [] }: Orders): Orders => ({ bids, asks }))
        ).subscribe((orders) => this.orders$.next(orders));
    }

    getOrders$(): Observable<Orders> {
        return this.orders$.asObservable();
    }
}
