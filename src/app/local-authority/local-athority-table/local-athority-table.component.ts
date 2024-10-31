import { Component } from '@angular/core';

@Component({
  selector: 'app-local-athority-table',
  templateUrl: './local-athority-table.component.html',
  styleUrls: ['./local-athority-table.component.css']
})
export class LocalAthorityTableComponent {

  dataSource = [
    { name: 'John Doe', age: 30, city: 'New York' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Bob Johnson', age: 35, city: 'Los Angeles' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' }, { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
    { name: 'Jane Smith', age: 25, city: 'San Francisco' },
  ];

  displayedColumns: string[] = ['name', 'age', 'select'];

  onSelect(payment: any): void {
    // Implement your logic when the button is clicked
    // console.log('Selected payment:', payment);
  }

}
