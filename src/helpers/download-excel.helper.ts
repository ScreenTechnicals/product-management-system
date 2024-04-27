import { ItemType } from "@/common/types";
import * as FileSaver from "file-saver";
import toast from "react-hot-toast";
import XLSX from "sheetjs-style";
export const downloadExcel = async (
  data: any,
  fileName: string,
  dataType: "items-in" | "items-stock" | "items-out"
) => {
  try {
    const formatedData = data.map((item: ItemType) => {
      if (dataType === "items-in") {
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
      } else if (dataType === "items-stock") {
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

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheet;charset=utf-8";

    const ws = XLSX.utils.json_to_sheet(formatedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excaleData = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(excaleData, `${fileName}.xlsx`);
    toast.success("File saved successfully");
  } catch (error) {
    console.log(error);
    toast.error("Failed to save file");
  }
};
