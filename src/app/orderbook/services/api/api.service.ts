import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { filter, map, switchMap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    getAskLevels$() {
        throw new Error('Method not implemented.');
    }
    private askLevels = new Map();
    private bidLevels = new Map();
    private askLevels$!: Observable<any>;
    private bidLevels$!: Observable<any>;
    
    constructor() {
        const wsSubject = webSocket('wss://www.cryptofacilities.com/ws/v1');
        const delta$ = wsSubject.pipe(
            map(({ bids = [], asks = [] }: any) => ({ bids, asks }))
        );

        this.bidLevels$ = delta$.pipe(
            switchMap((delta: any) => of(delta.bids)),
            filter(bids => bids.length !== 0),
            map(askUpdates => this.mapDeltaToTable(askUpdates, this.bidLevels)),
        );
        this.askLevels$ = delta$.pipe(
            switchMap((delta: any) => of(delta.asks)),
            filter(asks => asks.length !== 0),
            map(askUpdates => this.mapDeltaToTable(askUpdates, this.askLevels)),
        );
        
        wsSubject.next({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD']
        });
    }

    mapDeltaToTable(levelDelta: any, levelMap: Map<number, any>) {
        return levelDelta.reduce((accMap: any, curr: any) => {
            const levelPrice = curr[0];
            const levelSize = curr[1];
            const isExistingLevel = accMap.has(levelPrice);

            if (levelSize === 0 && isExistingLevel) {
                accMap.delete(levelPrice);

                return accMap;
            }

            if (!isExistingLevel && levelSize !== 0) {
                return accMap.set(levelPrice, { size: levelSize, total: levelSize })
            }

            if (!isExistingLevel && levelSize === 0) {
                return accMap;
            }

            const updatedLevelTotal = accMap.get(levelPrice).total + levelSize;

            return accMap.set(levelPrice, { size: levelSize, total: updatedLevelTotal });
        }, levelMap);
    }

    getBidLevels() {
        return this.bidLevels$;
    }

    getAskLevels() {
        return this.askLevels$;
    }
}
