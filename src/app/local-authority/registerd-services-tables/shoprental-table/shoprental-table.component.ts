import { Component } from '@angular/core';

@Component({
  selector: 'app-shoprental-table',
  templateUrl: './shoprental-table.component.html',
  styleUrls: ['./shoprental-table.component.css']
})
export class ShoprentalTableComponent {

  displayedColumnsStep2: string[] = ['column1', 'column2', 'column3', 'pay'];


  datasource = [
    { columnX: 'Value 5', columnY: 'Value 6', columnZ: 'Value 7', columnW: 'Value 8' },
    // Add more rows as needed
  ];
  onPay(){
    
  }

}
