import { Timestamp } from "firebase/firestore";

export type ItemType = {
  id: string;
  itemName: string;
  itemType: string;
  partyName: string;
  quantity: number;
  requisitionBy: string;
  rate: number;
  totalPrice: number;
  purchaseDate: Timestamp | undefined;
  issueDate?: Timestamp | undefined;
  ref?: string;
  remarks?: string;
};
