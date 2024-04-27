import { db } from "@/configs";
import {
  collection,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useSearchFilters = (
  collectionName: "items-in" | "items-stock" | "items-out",
  filterBy: "id" | "purchaseDate" | "requisitionBy" | "issueDate" | "stockRef",
  filterValue: string | Date | Timestamp
) => {
  const dbCollectionRef = collection(db, collectionName);

  const dbCollectionQuery = query(
    dbCollectionRef,
    orderBy(filterBy),
    where(filterBy, "==", filterValue)
  );
  const [dbCollectionSnapshots, loading] = useCollectionData(dbCollectionQuery);

  return {
    data: dbCollectionSnapshots,
    loading,
  };
};
