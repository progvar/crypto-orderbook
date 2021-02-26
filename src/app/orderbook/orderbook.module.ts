import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderbookComponent } from './orderbook.component';

@NgModule({
    imports: [
        CommonModule,
        MatTableModule
    ],
    declarations: [OrderbookComponent],
    exports: [OrderbookComponent],
})
export class OrderbookModule {}
