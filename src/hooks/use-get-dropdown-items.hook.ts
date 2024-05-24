import { CollectionNameType, LabelOptionType } from "@/common/types";
import { db } from "@/configs";
import { collection, orderBy, query } from "firebase/firestore";
import { useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useGetDropdownItems = (collectionName: CollectionNameType) => {
  const dropdownItemsRef = collection(db, collectionName!);
  const queryDropdownItems = query(dropdownItemsRef, orderBy("value"));
  const [dropdownItemsSnapshots, isLoadingDropdownItemsSpanshots] =
    useCollectionData(queryDropdownItems);

  const dropdownItems = useMemo(() => {
    let localItemNames: LabelOptionType[] = [
      {
        label: "add_new",
        value: "Add New",
      },
    ];
    if (!isLoadingDropdownItemsSpanshots) {
      dropdownItemsSnapshots?.forEach((item) => {
        localItemNames.push(item as LabelOptionType);
      });
    }
    return localItemNames;
  }, [isLoadingDropdownItemsSpanshots, dropdownItemsSnapshots]);

  return {
    data: dropdownItems,
  };
};
