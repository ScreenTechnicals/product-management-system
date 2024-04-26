import { ItemType } from "@/common/types";
import { db } from "@/configs";
import { doc, setDoc } from "firebase/firestore";

export const AddItemIn = async (item: ItemType) => {
  try {
    await setDoc(
      doc(db, "items-in", item.id),
      {
        ...item,
      },
      { merge: true }
    );
    await setDoc(
      doc(db, "items-stock", item.id),
      {
        ...item,
        issueDate: "",
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
