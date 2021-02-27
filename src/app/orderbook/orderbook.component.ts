import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from './services/api/api.service';

interface OrderbookDelta {
    price: number;
    size: number;
    total: number;
}

@Component({
  selector: 'app-orderbook',
  templateUrl: './orderbook.component.html',
  styleUrls: ['./orderbook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderbookComponent  {
    displayedColumns: string[] = ['price', 'size', 'total'];
    aksLevels = this.apiService.getAskLevels();
    bidLevels = this.apiService.getBidLevels();

    constructor(private apiService: ApiService) {}
}
