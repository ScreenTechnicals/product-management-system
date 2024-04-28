import { db } from "@/configs";
import * as FileSaver from "file-saver";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import toast from "react-hot-toast";
import XLSX from "sheetjs-style";

export type DownloadExcelProps = {
  fromDate: Timestamp | undefined;
  toDate: Timestamp | undefined;
  filterBy: string | undefined;
  collectionName: string | undefined;
};

export const downloadExcel = async (
  fromDate: Timestamp | undefined,
  toDate: Timestamp | undefined,
  filterBy: string | undefined,
  collectionName: string | undefined
) => {
  try {
    const dbCollectionRef = collection(db, collectionName!);

    const dbCollectionQuery = query(
      dbCollectionRef,
      where(filterBy!, ">=", fromDate),
      where(filterBy!, "<=", toDate)
    );

    const dbCollectionSnapshots = await getDocs(dbCollectionQuery);

    const formatedData = dbCollectionSnapshots.docs.map((doc: any) => {
      const item = doc.data();

      if (collectionName === "items-in") {
        return {
          "Item Id": item.id,
          "Item Name": item.itemName,
          "Item Type": item.itemType,
          "Party Name": item.partyName,
          "Item Quantity": item.quantity,
          "Item Rate": item.rate,
          "Total Price": item.totalPrice,
          "Purchase Date": new Date(
            (item?.purchaseDate?.seconds ?? 0) * 1000
          ).toLocaleDateString(),
          Remarks: item.remarks,
        };
      } else if (collectionName === "items-stock") {
        return {
          "Item Id": item.id,
          "Item Name": item.itemName,
          "Item Type": item.itemType,
          "Party Name": item.partyName,
          "Item Quantity": item.quantity,
          "Item Rate": item.rate,
          "Total Price": item.totalPrice,
          "Purchase Date": new Date(
            (item?.purchaseDate?.seconds ?? 0) * 1000
          ).toLocaleDateString(),
          "Issue Date": new Date(
            (item?.issueDate?.seconds ?? 0) * 1000
          ).toLocaleDateString(),
          Remarks: item.remarks,
        };
      } else {
        return {
          "Item Id": item.id,
          "Stock Ref": item.stockRef,
          "Item Name": item.itemName,
          "Item Type": item.itemType,
          "Party Name": item.partyName,
          "Item Quantity": item.quantity,
          "Item Rate": item.rate,
          "Total Price": item.totalPrice,
          "Purchase Date": new Date(
            (item?.purchaseDate?.seconds ?? 0) * 1000
          ).toLocaleDateString(),
          "Issue Date": new Date(
            (item?.issueDate?.seconds ?? 0) * 1000
          ).toLocaleDateString(),
          Remarks: item.remarks,
        };
      }
    });

    const fileName = `${collectionName}-${new Date(
      (fromDate?.seconds ?? 0) * 1000
    ).toLocaleDateString()}-${new Date(
      (toDate?.seconds ?? 0) * 1000
    ).toLocaleDateString()}`;

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheet;charset=utf-8";

    if (formatedData.length > 0) {
      const ws = XLSX.utils.json_to_sheet(formatedData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const excaleData = new Blob([excelBuffer], { type: fileType });

      FileSaver.saveAs(excaleData, `${fileName}.xlsx`);
      toast.success("File saved successfully");
    } else {
      toast.error("No data found to save");
    }
  } catch (error) {
    console.log(error);
    toast.error("Failed to save file");
  }
};
