import { Component } from '@angular/core';

interface OrderbookDelta {
    price: number;
    size: number;
    total: number;
}
  
const dataSource: OrderbookDelta[] = [
    {price: 1, size: 100, total: 1234567, },
    {price: 2, size: 100, total: 1234567, },
    {price: 3, size: 100, total: 1234567, },
    {price: 4, size: 100, total: 1234567, },
    {price: 5, size: 100, total: 1234567, },
    {price: 6, size: 100, total: 1234567, },
    {price: 7, size: 100, total: 1234567, },
    {price: 8, size: 100, total: 1234567, },
    {price: 9, size: 100, total: 1234567, },
    {price: 10, size: 100, total: 1234567, }
]

@Component({
  selector: 'app-orderbook',
  templateUrl: './orderbook.component.html',
  styleUrls: ['./orderbook.component.scss']
})
export class OrderbookComponent {
    dataSource = dataSource;
    displayedColumns: string[] = ['price', 'size', 'total'];
}
