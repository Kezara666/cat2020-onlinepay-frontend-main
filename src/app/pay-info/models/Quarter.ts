import {AssessmentBalance} from "./AssessmentBalance";

export class Quarter {
  id?: number;
  amount?: number;
  byExcessDeduction?:number;
  paid?: number;
  discount?: number;
  warrant?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  isCompleted?: boolean | null;
  isOver?: boolean | null;
  balanceId?: number;
  assessmentBalance?: AssessmentBalance | null;
}
