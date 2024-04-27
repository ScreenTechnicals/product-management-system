import { db } from "@/configs";
import { deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";

export const deleteItem = async (id: string, collection: string) => {
  try {
    await deleteDoc(doc(db, collection, id));
    toast.success("Item deleted successfully");
    return true;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
    return false;
  }
};
