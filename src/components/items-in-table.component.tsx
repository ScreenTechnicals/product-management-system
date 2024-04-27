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

  return (
    <Table
      isHeaderSticky
      color="danger"
      isStriped
      aria-label="item table component"
      bottomContent={
        (itemsInDataSanpshots ?? [])?.length > 0 &&
        !isItemsInDataSnapshotsLoading ? (
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
      }
      classNames={{
        base: "max-h-[80svh] overflow-auto",
        // table: "min-h-[420px]",
      }}
    >
      <TableHeader>
        {tableHeaders.map((item) => {
          return <TableColumn key={item.key}>{item.value}</TableColumn>;
        })}
      </TableHeader>
      <TableBody
        isLoading={isItemsInDataSnapshotsLoading}
        items={JSON.parse(JSON.stringify(itemsInDataSanpshots ?? []))}
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
  );
};
