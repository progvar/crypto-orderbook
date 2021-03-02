import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';
import { Orders } from '../../models/models';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private orders$: Subject<any> = new Subject();
    
    constructor() {
        const wsSubject = webSocket<any>('wss://www.cryptofacilities.com/ws/v1');
        
        wsSubject.next({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD']
        });

        wsSubject.subscribe(this.orders$);
    }

    getMessages$(): Observable<any> {
        return this.orders$.asObservable();
    }
}
