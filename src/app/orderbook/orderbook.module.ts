import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderbookComponent } from './orderbook.component';
import { BookComponent } from './components/book/book.component';

@NgModule({
    imports: [
        CommonModule,
        MatTableModule
    ],
    declarations: [BookComponent, OrderbookComponent],
    exports: [BookComponent, OrderbookComponent],
})
export class OrderbookModule {}
