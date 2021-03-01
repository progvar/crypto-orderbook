import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Orderbook } from './models/models';
import { OrderbookService } from './services/orderbook/orderbook.service';

@Component({
  selector: 'app-orderbook',
  templateUrl: './orderbook.component.html',
  styleUrls: ['./orderbook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderbookComponent  {
    displayedColumns: string[] = ['price', 'size', 'total'];
    asks$: Observable<Orderbook> = this.orderbookService.getAsks$();
    bids$: Observable<Orderbook> = this.orderbookService.getBids$();

    constructor(private orderbookService: OrderbookService) {}
}
