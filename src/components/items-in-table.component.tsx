"use client";

import { ItemType, SearchFilterType } from "@/common/types";
import { db } from "@/configs";
import { copyToClipboard } from "@/helpers";
import { useSearchFilters } from "@/hooks";
import {
  Button,
  getKeyValue,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import {
  collection,
  limit,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { SiMicrosoftexcel } from "react-icons/si";
import { DownloadItemsModal } from "./download-items-modal.component";
import { SearchAndDownloadContainer } from "./search-and-download-container.component";

type QueryFiltersType = {
  orderBy: string;
  orderDirection: "desc" | "asc";
  limit: number;
};
type ItemsInTableProps = {
  onOpenModal: () => void;
  setSelectedItem: (item: ItemType) => void;
};

const tableHeaders = [
  {
    key: "slno",
    value: "Sl No.",
  },
  {
    key: "id",
    value: "Item Id",
  },
  {
    key: "itemName",
    value: "Item Name",
  },
  {
    key: "itemType",
    value: "Item Type",
  },
  {
    key: "partyName",
    value: "Party Name",
  },
  {
    key: "quantity",
    value: "Quantity",
  },
  {
    key: "rate",
    value: "Rate (in ₹)",
  },
  {
    key: "totalPrice",
    value: "Total Price (in ₹)",
  },
  {
    key: "requisitionBy",
    value: "Requisition By",
  },
  {
    key: "purchaseDate",
    value: "Purchase Date",
  },
  {
    key: "remarks",
    value: "Remarks",
  },
  {
    key: "actions",
    value: "Actions",
  },
];

const searchFilters: SearchFilterType[] = [
  {
    key: "id",
    value: "Item ID",
    type: "string",
  },
  {
    key: "purchaseDate",
    value: "Date Purchased",
    type: "date",
  },
  {
    key: "requisitionBy",
    value: "Requisition",
    type: "string",
  },
];

export const ItemsInTable = ({
  onOpenModal,
  setSelectedItem,
}: ItemsInTableProps) => {
  const [queryFilters, setQueryFilters] = useState<QueryFiltersType>({
    orderBy: "id",
    orderDirection: "desc",
    limit: 15,
  });

  let slno = 1;

  const itemsInRef = collection(db, "items-in");
  const itemsInRefQuery = query(
    itemsInRef,
    orderBy(queryFilters.orderBy, queryFilters.orderDirection),
    limit(queryFilters.limit)
  );

  const [itemsInDataSanpshots, isItemsInDataSnapshotsLoading] =
    useCollectionData(itemsInRefQuery);

  const [selectedFilterOption, setSelectedFilterOption] = useState<
    (typeof searchFilters)[number]
  >(searchFilters[0]);

  const [selectedFilterValue, setSelectedFilterValue] = useState<
    string | Date | Timestamp
  >("");
  const [searchValue, setSearchValue] = useState("");
  const { data: queryData, loading: isLoadingQueryData } = useSearchFilters(
    "items-in",
    selectedFilterOption.key,
    selectedFilterValue
  );

  const isItemsInDataSnapshots =
    (itemsInDataSanpshots ?? [])?.length > 0 && !isItemsInDataSnapshotsLoading;
  const isQueryData = queryData?.length === 0 || queryData === undefined;

  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col gap-3 sticky top-20 left-0">
      <SearchAndDownloadContainer
        onOpenDownloadModal={onOpen}
        itemsDataSanpshots={isItemsInDataSnapshots}
        searchFilters={searchFilters}
        searchValue={searchValue}
        selectedFilterOption={selectedFilterOption}
        setSearchValue={setSearchValue}
        setSelectedFilterOption={setSelectedFilterOption}
        setSelectedFilterValue={setSelectedFilterValue}
      />
      <Table
        isHeaderSticky
        color="danger"
        isStriped
        aria-label="item table component"
        bottomContent={
          isQueryData ? (
            isItemsInDataSnapshots ? (
              <div className="flex w-full justify-center">
                <Button
                  isDisabled={isItemsInDataSnapshotsLoading}
                  variant="flat"
                  onPress={() => {
                    setQueryFilters((data) => {
                      return {
                        ...data,
                        limit: queryFilters.limit + 15,
                      };
                    });
                  }}
                >
                  {isItemsInDataSnapshotsLoading && (
                    <Spinner color="white" size="sm" />
                  )}
                  Load More
                </Button>
              </div>
            ) : (
              !isItemsInDataSnapshotsLoading && (
                <div className="w-full flex text-center place-items-center place-content-center h-[200px] text-2xl text-[#eeeeee]">
                  No Data Found
                </div>
              )
            )
          ) : (
            ""
          )
        }
        classNames={{
          base: "md:max-h-[80svh] max-h-[70svh]  overflow-auto py-3",
        }}
      >
        <TableHeader>
          {tableHeaders.map((item) => {
            return <TableColumn key={item.key}>{item.value}</TableColumn>;
          })}
        </TableHeader>
        <TableBody
          isLoading={
            isQueryData ? isItemsInDataSnapshotsLoading : isLoadingQueryData
          }
          items={
            isQueryData
              ? JSON.parse(JSON.stringify(itemsInDataSanpshots ?? []))
              : JSON.parse(JSON.stringify(queryData ?? []))
          }
          loadingContent={<Spinner />}
        >
          {(item: ItemType) => (
            <TableRow key={item.id}>
              {(columnKey) => {
                if (columnKey === "purchaseDate") {
                  return (
                    <TableCell>
                      {new Date(
                        getKeyValue(item, columnKey).seconds * 1000
                      ).toDateString()}
                    </TableCell>
                  );
                } else if (columnKey === "id") {
                  return (
                    <TableCell
                      onClick={() => {
                        copyToClipboard(item.id);
                      }}
                      className="cursor-pointer"
                    >
                      {getKeyValue(item, columnKey)}
                    </TableCell>
                  );
                } else if (columnKey === "slno") {
                  return <TableCell>({slno++})</TableCell>;
                } else if (columnKey === "rate") {
                  const rate = new Intl.NumberFormat("en-IN").format(
                    parseFloat(getKeyValue(item, columnKey))
                  );
                  return <TableCell>{rate}</TableCell>;
                } else if (columnKey === "totalPrice") {
                  const totalPrice = new Intl.NumberFormat("en-IN").format(
                    parseFloat(getKeyValue(item, columnKey))
                  );
                  return <TableCell>{totalPrice}</TableCell>;
                } else if (columnKey === "actions") {
                  return (
                    <TableCell>
                      <Button
                        variant="flat"
                        color="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          onOpenModal();
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  );
                }

                return (
                  <TableCell>
                    {getKeyValue(item, columnKey) === "" ||
                    getKeyValue(item, columnKey) === null ||
                    getKeyValue(item, columnKey) === undefined
                      ? "- - -"
                      : getKeyValue(item, columnKey)}
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Button
        variant="shadow"
        className="md:hidden"
        onClick={onOpen}
        color="success"
        startContent={<SiMicrosoftexcel size={20} />}
      >
        Download Excel
      </Button>
      <DownloadItemsModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};
