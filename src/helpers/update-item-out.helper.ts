import { ItemType } from "@/common/types";
import { db } from "@/configs";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export const updateItemOut = async (item: ItemType) => {
  try {
    const itemOutRef = doc(db, "items-out", item.id);
    await updateDoc(itemOutRef, {
      remarks: item.remarks,
    });
    toast.success("Remarks Updated Successfully!");
    return true;
  } catch (error) {
    console.log(error);
    toast.error("Something Went Wrong!");
    return false;
  }
};
