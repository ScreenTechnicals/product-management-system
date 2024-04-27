import { ItemType } from "@/common/types";
import { db } from "@/configs";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export const sendOutItemToStockItem = async (item: ItemType) => {
  try {
    const itemOutRef = doc(db, "items-out", item.id);
    const itemOutSnap = await getDoc(itemOutRef);

    const stockRef = itemOutSnap?.data()?.stockRef;

    const itemStockRef = doc(db, "items-stock", stockRef);
    const itemStockSnap = await getDoc(itemStockRef);

    await updateDoc(itemStockRef, {
      quantity: item.quantity + itemStockSnap?.data()?.quantity,
      totalPrice: item.totalPrice + itemStockSnap?.data()?.totalPrice,
    });
    await deleteDoc(doc(db, "items-out", item.id));
    toast.success("Item Sent Back to Stock Successfully!");
    return true;
  } catch (error) {
    console.log(error);
    toast.error("Something Went Wrong!");
    return false;
  }
};
