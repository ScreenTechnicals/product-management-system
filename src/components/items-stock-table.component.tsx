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

type QueryFiltersType = {
  orderBy: string;
  orderDirection: "desc" | "asc";
  limit: number;
};

var slno = 1;

const tableHeaders = [
  {
    key: "slno",
    vale: "Sl No.",
  },
  {
    key: "id",
    value: "Ref. Id",
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
    value: "Rate",
  },
  {
    key: "totalPrice",
    value: "Total Price",
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

export const ItemsStockTable = () => {
  const [queryFilters, setQueryFilters] = useState<QueryFiltersType>({
    orderBy: "id",
    orderDirection: "desc",
    limit: 15,
  });

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
          return <TableColumn key={item.key}>{item.value}</TableColumn>;
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
              } else if (columnKey === "actions") {
                return (
                  <TableCell>
                    <Button
                      variant="flat"
                      color="primary"
                      size="sm"
                      onClick={() => {
                        console.log("Delete", item.id);
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
  );
};
