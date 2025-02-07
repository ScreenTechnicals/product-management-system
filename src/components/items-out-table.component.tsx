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
import { twJoin } from "tailwind-merge";
import { DownloadItemsModal } from "./download-items-modal.component";
import { SearchAndDownloadContainer } from "./search-and-download-container.component";

type QueryFiltersType = {
  orderBy: string;
  orderDirection: "desc" | "asc";
  limit: number;
};

type ItemsOutTableProps = {
  onOpenEditModal: () => void;
  onOpenIssueModal: () => void;
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
    key: "stockRef",
    value: "Stock Ref.",
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
    key: "issueDate",
    value: "Issue Date",
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
    key: "stockRef",
    value: "Stock Ref",
    type: "string",
  },
  {
    key: "purchaseDate",
    value: "Date Purchased",
    type: "date",
  },
  {
    key: "issueDate",
    value: "Date Issued",
    type: "date",
  },
  {
    key: "requisitionBy",
    value: "Requisition",
    type: "string",
  },
];

export const ItemsOutTable = ({
  onOpenEditModal,
  onOpenIssueModal,
  setSelectedItem,
}: ItemsOutTableProps) => {
  const [queryFilters, setQueryFilters] = useState<QueryFiltersType>({
    orderBy: "id",
    orderDirection: "desc",
    limit: 15,
  });

  let slno = 1;

  const itemsOutRef = collection(db, "items-out");
  const itemsOutRefQuery = query(
    itemsOutRef,
    orderBy(queryFilters.orderBy, queryFilters.orderDirection),
    limit(queryFilters.limit)
  );

  const [itemsOutDataSanpshots, isItemsOutDataSnapshotsLoading] =
    useCollectionData(itemsOutRefQuery);
  const [selectedFilterOption, setSelectedFilterOption] = useState<
    (typeof searchFilters)[number]
  >(searchFilters[0]);

  const [selectedFilterValue, setSelectedFilterValue] = useState<
    string | Date | Timestamp
  >("");
  const [searchValue, setSearchValue] = useState("");
  const { data: queryData, loading: isLoadingQueryData } = useSearchFilters(
    "items-out",
    selectedFilterOption.key,
    selectedFilterValue
  );

  const isItemsOutDataSnapshots =
    (itemsOutDataSanpshots ?? [])?.length > 0 &&
    !isItemsOutDataSnapshotsLoading;
  const isQueryData = queryData?.length === 0 || queryData === undefined;
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col gap-3 sticky top-20 left-0">
      <SearchAndDownloadContainer
        onOpenDownloadModal={onOpen}
        itemsDataSanpshots={isItemsOutDataSnapshots}
        searchFilters={searchFilters}
        searchValue={searchValue}
        selectedFilterOption={selectedFilterOption}
        setSearchValue={setSearchValue}
        setSelectedFilterOption={setSelectedFilterOption}
        setSelectedFilterValue={setSelectedFilterValue}
      />
      <Table
        isHeaderSticky
        isStriped
        aria-label="item table component"
        bottomContent={
          isQueryData ? (
            isItemsOutDataSnapshots ? (
              <div className="flex w-full justify-center">
                <Button
                  isDisabled={isItemsOutDataSnapshotsLoading}
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
                  {isItemsOutDataSnapshotsLoading && (
                    <Spinner color="white" size="sm" />
                  )}
                  Load More
                </Button>
              </div>
            ) : (
              !isItemsOutDataSnapshotsLoading && (
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
          base: "md:max-h-[80svh] max-h-[70svh] overflow-auto",
        }}
      >
        <TableHeader>
          {tableHeaders.map((item) => {
            return (
              <TableColumn
                key={item.key}
                className={twJoin(item.key === "actions" && "text-center")}
              >
                {item.value}
              </TableColumn>
            );
          })}
        </TableHeader>
        <TableBody
          isLoading={
            isQueryData ? isItemsOutDataSnapshotsLoading : isLoadingQueryData
          }
          items={
            isQueryData
              ? JSON.parse(JSON.stringify(itemsOutDataSanpshots ?? []))
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
                }
                if (columnKey === "issueDate") {
                  return (
                    <TableCell>
                      {getKeyValue(item, columnKey)?.seconds !== undefined ||
                      getKeyValue(item, columnKey)?.seconds === ""
                        ? new Date(
                            getKeyValue(item, columnKey)?.seconds * 1000
                          ).toDateString()
                        : "- - -"}
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
                } else if (columnKey === "stockRef") {
                  return (
                    <TableCell
                      onClick={() => {
                        if (item?.stockRef) copyToClipboard(item.stockRef);
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
                    <TableCell className="flex items-center justify-center gap-4">
                      <Button
                        variant="flat"
                        color="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          onOpenEditModal();
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
