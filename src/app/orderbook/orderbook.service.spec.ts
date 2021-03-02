import { TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { TestScheduler } from  'rxjs/testing'
import { Orderbook, Orders } from './models/models';
import { ApiService } from './services/api/api.service';
import { OrderbookService } from './orderbook.service';

describe('OrderbookService', () => {
    let testScheduler: TestScheduler;
    let orderbookService: OrderbookService;
    let messages$: Subject<any>;
    let mockApiService: {
        getMessages$: () => Observable<Orders>;
    };

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        messages$ = new Subject();
        mockApiService = {
            getMessages$: () => messages$.asObservable()
        };

        TestBed.configureTestingModule({
            providers: [
                OrderbookService,
                { provide: ApiService, useValue: mockApiService },
            ]
        });

        orderbookService = TestBed.inject(OrderbookService);
    });

    it('should create', () => {
        expect(orderbookService).toBeDefined();
    });

    it('should return an empty Map() for both bids and asks', () => testScheduler.run(({ expectObservable }) => {
        const expectedBids: Orderbook = new Map();
        const expectedAsks: Orderbook = new Map();

        const bids$ = new ReplaySubject<Orderbook>(1);
        const asks$ = new ReplaySubject<Orderbook>(1);

        orderbookService.getBids$().subscribe(bids$);
        orderbookService.getAsks$().subscribe(asks$);

        expectObservable(bids$).toBe('(a)', { a: expectedBids });
        expectObservable(asks$).toBe('(a)', { a: expectedAsks });
    }));

    it('should NOT insert the given bid and ask level if the new delta is 0', () => testScheduler.run(({ expectObservable }) => {
        const expectedBids: Orderbook = new Map();
        const expectedAsks: Orderbook = new Map();

        const bids$ = new ReplaySubject<Orderbook>(1);
        const asks$ = new ReplaySubject<Orderbook>(1);
        
        orderbookService.getBids$().subscribe(bids$);
        orderbookService.getAsks$().subscribe(asks$);
        
        messages$.next({ bids: [[ 1, 0 ]], asks: [[ 2, 0 ]] });

        expectObservable(bids$).toBe('(a)', { a: expectedBids });
        expectObservable(asks$).toBe('(a)', { a: expectedAsks });
    }));

    it('should get the first bids and asks', () => testScheduler.run(({ expectObservable }) => {
        const expectedBids = new Map().set(1, { size: 1, total: 1 });
        const expectedAsks = new Map().set(2, { size: 2, total: 2 });

        const bids$ = new ReplaySubject<Orderbook>(2);
        const asks$ = new ReplaySubject<Orderbook>(2);
        
        orderbookService.getBids$().subscribe(bids$);
        orderbookService.getAsks$().subscribe(asks$);
        
        messages$.next({ bids: [], asks: [] });
        messages$.next({ bids: [[ 1, 1 ]], asks: [[ 2, 2 ]] });

        expectObservable(bids$).toBe('(ab)', { a: new Map(), b: expectedBids });
        expectObservable(asks$).toBe('(ab)', { a: new Map(), b: expectedAsks });
    }));

    it('should get the overwrittem bids and asks', () => testScheduler.run(({ expectObservable }) => {
        const expectedBids1: Orderbook = new Map().set(1, { size: 1, total: 1 });
        const expectedBids2: Orderbook = new Map().set(1, { size: 2, total: 3 });
        const expectedAsks1: Orderbook = new Map().set(2, { size: 2, total: 2 });
        const expectedAsks2: Orderbook = new Map().set(2, { size: 4, total: 6 });

        const bids$ = new ReplaySubject<Orderbook>(2);
        const asks$ = new ReplaySubject<Orderbook>(2);
        
        orderbookService.getBids$().subscribe(bids$);
        orderbookService.getAsks$().subscribe(asks$);
        
        messages$.next({ bids: [[ 1, 1 ]], asks: [[ 2, 2 ]] });
        messages$.next({ bids: [[ 1, 2 ]], asks: [[ 2, 4 ]] });

        expectObservable(bids$).toBe('(ab)', { a: expectedBids1, b: expectedBids2 });
        expectObservable(asks$).toBe('(ab)', { a: expectedAsks1, b: expectedAsks2 });
    }));

    it('should delete the given bid and ask level if the new delta is 0', () => testScheduler.run(({ expectObservable }) => {
        const expectedBids1: Orderbook = new Map().set(1, { size: 1, total: 1 });
        const expectedBids2: Orderbook = new Map();
        const expectedAsks1: Orderbook = new Map().set(2, { size: 2, total: 2 });
        const expectedAsks2: Orderbook = new Map();

        const bids$ = new ReplaySubject<Orderbook>(2);
        const asks$ = new ReplaySubject<Orderbook>(2);
        
        orderbookService.getBids$().subscribe(bids$);
        orderbookService.getAsks$().subscribe(asks$);
        
        messages$.next({ bids: [[ 1, 1 ]], asks: [[ 2, 2 ]] });
        messages$.next({ bids: [[ 1, 0 ]], asks: [[ 2, 0 ]] });

        expectObservable(bids$).toBe('(ab)', { a: expectedBids1, b: expectedBids2 });
        expectObservable(asks$).toBe('(ab)', { a: expectedAsks1, b: expectedAsks2 });
    }));
  });