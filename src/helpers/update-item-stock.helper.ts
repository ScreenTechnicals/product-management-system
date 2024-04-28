import { ItemType } from "@/common/types";
import { db } from "@/configs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export const updateItemStock = async (item: ItemType) => {
  try {
    const itemInRef = doc(db, "items-in", item.id);
    const itemStockRef = doc(db, "items-stock", item.id);

    const itemStockSnap = await getDoc(itemStockRef);

    if (!itemStockSnap?.data()?.issueDate && item.issueDate) {
      toast.error("This item is not issued yet! Please issue the item first!");
      return false;
    }

    await updateDoc(itemStockRef, {
      itemName: item.itemName,
      itemType: item.itemType,
      partyName: item.partyName,
      requisitionBy: item.requisitionBy,
      purchaseDate: new Date((item?.purchaseDate?.seconds ?? 0) * 1000),
      issueDate: itemStockSnap?.data()?.issueDate
        ? new Date((item?.issueDate?.seconds ?? 0) * 1000)
        : "",
      quantity: item.quantity,
      rate: item.rate,
      totalPrice: item.totalPrice,
      remarks: item.remarks,
    });

    toast.success("Stocks Updated Successfully!");

    if (
      itemStockSnap.data()?.issueDate === undefined ||
      itemStockSnap.data()?.issueDate === ""
    ) {
      await updateDoc(itemInRef, {
        itemName: item.itemName,
        itemType: item.itemType,
        partyName: item.partyName,
        requisitionBy: item.requisitionBy,
        purchaseDate: new Date((item?.purchaseDate?.seconds ?? 0) * 1000),
        quantity: item.quantity,
        rate: item.rate,
        totalPrice: item.totalPrice,
        remarks: item.remarks,
      });
      toast.success("Items-In Updated Successfully!");
    } else {
      await updateDoc(itemInRef, {
        itemName: item.itemName,
        itemType: item.itemType,
        partyName: item.partyName,
        requisitionBy: item.requisitionBy,
        purchaseDate: new Date((item?.purchaseDate?.seconds ?? 0) * 1000),
        remarks: item.remarks,
      });
      toast.success("Items-In Updated Successfully!");
      toast.error("Please Update The Quantity and Rate Manually In Items-In!", {
        icon: "🚨",
      });
    }
    return true;
  } catch (error) {
    console.error("Error updating item: ", error);
    toast.success("Something Went Wrong!");
    return false;
  }
};
