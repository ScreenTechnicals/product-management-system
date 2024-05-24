import { ItemType } from "@/common/types";
import { db } from "@/configs";
import { doc, setDoc } from "firebase/firestore";

export const AddItemIn = async (item: ItemType, uid: string) => {
  try {
    await setDoc(
      doc(db, "items-in", item.id),
      {
        ...item,
        uid: uid,
      },
      { merge: true }
    );
    await setDoc(
      doc(db, "items-stock", item.id),
      {
        ...item,
        issueDate: "",
        uid: uid,
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
