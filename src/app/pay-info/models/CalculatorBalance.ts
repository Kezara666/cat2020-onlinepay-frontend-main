import { Assessment } from "./Assessment";
import {Quarter} from "./Quarter";

export class CalculatorBalance {


  lyArrears?:number;
  lyWarrant?:number;
  tyArrears?:number;
  tyWarrant?:number;

  total?:number;
  overPayment?:number;
  discount?:number;

  q1?:number;
  q2?:number;
  q3?:number;
  q4?:number;

  constructor() {
    this.lyArrears = 0;
    this.lyWarrant = 0;
    this.tyArrears = 0;
    this.tyWarrant = 0;
    this.total = 0;
    this.overPayment = 0;
    this.discount = 0;
    this.q1 = 0;
    this.q2 = 0;
    this.q3 = 0;
    this.q4 = 0;
  }

}
