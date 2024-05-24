import { LabelOptionType } from "@/common/types";
import { db } from "@/configs";
import { doc, setDoc } from "firebase/firestore";

export const addNewParty = async (partyName: LabelOptionType) => {
  try {
    await setDoc(
      doc(db, "party-names", partyName.label),
      {
        ...partyName,
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
