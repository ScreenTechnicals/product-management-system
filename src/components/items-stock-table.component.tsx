"use client";

import { ItemType } from "@/common/types";
import { db } from "@/configs";
import { copyToClipboard } from "@/helpers";
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
} from "@nextui-org/react";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { twJoin } from "tailwind-merge";

type QueryFiltersType = {
  orderBy: string;
  orderDirection: "desc" | "asc";
  limit: number;
};

type ItemsStockTableProps = {
  onOpenEditModal: () => void;
  onOpenIssueModal: () => void;
  setSelectedItem: (item: ItemType) => void;
};

const tableHeaders = [
  {
    key: "slno",
    vale: "Sl No.",
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

export const ItemsStockTable = ({
  onOpenEditModal,
  onOpenIssueModal,
  setSelectedItem,
}: ItemsStockTableProps) => {
  const [queryFilters, setQueryFilters] = useState<QueryFiltersType>({
    orderBy: "id",
    orderDirection: "desc",
    limit: 15,
  });

  let slno = 1;

  const itemsStockRef = collection(db, "items-stock");
  const itemsStockRefQuery = query(
    itemsStockRef,
    orderBy(queryFilters.orderBy, queryFilters.orderDirection),
    limit(queryFilters.limit)
  );

  const [itemsStockDataSanpshots, isItemsStockDataSnapshotsLoading] =
    useCollectionData(itemsStockRefQuery);

  return (
    <Table
      isHeaderSticky
      isStriped
      aria-label="item table component"
      bottomContent={
        (itemsStockDataSanpshots ?? [])?.length > 0 &&
        !isItemsStockDataSnapshotsLoading ? (
          <div className="flex w-full justify-center">
            <Button
              isDisabled={isItemsStockDataSnapshotsLoading}
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
              {isItemsStockDataSnapshotsLoading && (
                <Spinner color="white" size="sm" />
              )}
              Load More
            </Button>
          </div>
        ) : (
          !isItemsStockDataSnapshotsLoading && (
            <div className="w-full flex text-center place-items-center place-content-center h-[200px] text-2xl text-[#eeeeee]">
              No Data Found
            </div>
          )
        )
      }
      classNames={{
        base: "max-h-[80svh] overflow-auto",
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
        isLoading={isItemsStockDataSnapshotsLoading}
        items={JSON.parse(JSON.stringify(itemsStockDataSanpshots ?? []))}
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
                    <Button
                      variant="flat"
                      color="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        onOpenIssueModal();
                      }}
                    >
                      Issue
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
  );
};
