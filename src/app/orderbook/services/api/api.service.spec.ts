import { ApiService} from './api.service';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { TestScheduler } from  'rxjs/testing'
import { Orders } from '../../models/models';
import * as rxJsWebSocket from 'rxjs/webSocket';

describe('ApiService', () => {
    let apiService: ApiService;
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });

        apiService = new ApiService();
    });

    it('should create the service', () => {
        expect(apiService).toBeDefined();
    });

    // Getting an Error: <spyOn> : webSocket is not declared writable or has no setter; on line 38
    // Can't mock module exports as of now, more details: https://github.com/jasmine/jasmine/issues/1414
    // Alternative solutions
    //     1) Switch to Jest and use it's module mocking feature
    //     2) Use the native browser WS API and create a Rx stream from it 
    xit('should create WebSocket connection', () => testScheduler.run(({ expectObservable }) => {
        const message = {
            feed: 'book_ui_1',
            product_id: 'PI_XBTUSD',
            bids: [[ 48100.5, 0.0 ]],
            asks: []
        };
        const wsSubject = new Subject();
        const webSocketSpy = spyOn<any>(rxJsWebSocket, 'webSocket').and.returnValue(wsSubject);
        const orders$ = new ReplaySubject<Orders>();

        apiService.getMessages$().subscribe(orders$);

        wsSubject.next(message);

        expect(webSocketSpy).toHaveBeenCalledWith('wss://www.cryptofacilities.com/ws/v1');
        expectObservable(orders$).toBe('(a)', { a: message });
      }));
  });