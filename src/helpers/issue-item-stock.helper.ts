import { ItemType } from "@/common/types";
import { db } from "@/configs";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export const issueItemStock = async (item: ItemType) => {
  try {
    if (!item.issueDate) {
      toast.error("Please Select Issue Date!");
      return false;
    }
    const itemStockRef = doc(db, "items-stock", item?.stockRef ?? "");
    const itemStockSnap = await getDoc(itemStockRef);

    if (!itemStockSnap.exists()) {
      toast.error("Item Not Found!");
      return false;
    }

    if (itemStockSnap?.data()?.quantity === 0) {
      toast.error("Item Out of Stock!");
      return false;
    }
    if (itemStockSnap?.data()?.quantity < item.quantity) {
      toast.error("Item Out of Stock!");
      return false;
    }

    await setDoc(
      doc(db, "items-out", item.id),
      {
        ...item,
      },
      { merge: true }
    );

    await updateDoc(itemStockRef, {
      issueDate: item.issueDate,
      quantity: itemStockSnap?.data()?.quantity - item.quantity,
      rate: item.rate,
      totalPrice: (itemStockSnap?.data()?.quantity - item.quantity) * item.rate,
    });

    toast.success("Item Issued Successfully!");
    toast.success("Stocks Updated Successfully!");
    return true;
  } catch (error) {
    console.log(error);

    toast.error("Something Went Wrong!");
    return false;
  }
};
