import { Component } from '@angular/core';

@Component({
  selector: 'app-assesment-tax-table',
  templateUrl: './assesment-tax-table.component.html',
  styleUrls: ['./assesment-tax-table.component.css']
})
export class AssesmentTaxTableComponent {
  displayedColumnsStep2: string[] = ['column1', 'column2', 'column3', 'pay'];


  datasource = [
    { columnX: 'Value 5', columnY: 'Value 6', columnZ: 'Value 7', columnW: 'Value 8' },
    // Add more rows as needed
  ];
  onPay(){
    
  }

}
