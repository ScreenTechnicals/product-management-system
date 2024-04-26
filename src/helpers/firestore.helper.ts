import { Timestamp } from "firebase/firestore";

export const convertDateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};
