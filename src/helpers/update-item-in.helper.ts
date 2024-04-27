import { ItemType } from "@/common/types";
import { db } from "@/configs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export const updateItemIn = async (item: ItemType) => {
  try {
    const itemsInRef = doc(db, "items-in", item.id.toUpperCase());
    const itemsStockRef = doc(db, "items-stock", item.id.toUpperCase());
    // const itemsOutRef = doc(db, "items-out", item.id); // item out id = OUT-<same id as in/stock>-<timestamp>

    const itemStockSnap = await getDoc(itemsStockRef);

    await updateDoc(itemsInRef, {
      itemName: item.itemName,
      itemType: item.itemType,
      partyName: item.partyName,
      requisitionBy: item.requisitionBy,
      purchaseDate: item.purchaseDate,
      quantity: item.quantity,
      rate: item.rate,
      totalPrice: item.totalPrice,
      remarks: item.remarks,
    });
    toast.success("Items-In Updated Successfully!");

    if (
      itemStockSnap.data()?.issueDate === undefined ||
      itemStockSnap.data()?.issueDate === ""
    ) {
      await updateDoc(itemsStockRef, {
        itemName: item.itemName,
        itemType: item.itemType,
        partyName: item.partyName,
        requisitionBy: item.requisitionBy,
        purchaseDate: item.purchaseDate,
        quantity: item.quantity,
        rate: item.rate,
        totalPrice: item.totalPrice,
        remarks: item.remarks,
      });
      toast.success("Stocks Updated Successfully!");
    } else {
      await updateDoc(itemsStockRef, {
        itemName: item.itemName,
        itemType: item.itemType,
        partyName: item.partyName,
        requisitionBy: item.requisitionBy,
        purchaseDate: item.purchaseDate,
        remarks: item.remarks,
      });
      toast.success("Stocks Updated Successfully!");
      toast.error("Please Update The Quantity and Rate Manually In Stocks!", {
        icon: "🚨",
      });
    }
    return true;
  } catch (error) {
    console.error("Error updating item: ", error);
    toast.error("Something Went Wrong!");
    return false;
  }
};
