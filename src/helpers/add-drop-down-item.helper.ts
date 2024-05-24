import { CollectionNameType, LabelOptionType } from "@/common/types";
import { db } from "@/configs";
import { doc, setDoc } from "firebase/firestore";

export const addNewDropDownItem = async (
  item: LabelOptionType,
  collectionName: CollectionNameType
) => {
  try {
    if (collectionName) {
      await setDoc(
        doc(db, collectionName, item.label),
        {
          ...item,
        },
        { merge: true }
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
