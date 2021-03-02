import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookComponent  {
    @Input() orders = new Map();

    displayedColumns: string[] = ['price', 'size', 'total'];
}
