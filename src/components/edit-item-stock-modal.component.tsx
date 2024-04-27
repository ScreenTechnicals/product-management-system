"use client";

import { itemTypes } from "@/common/consts";
import { partyNames } from "@/common/consts/party-names.const";
import { ItemType } from "@/common/types";
import { convertDateToTimestamp, updateItemStock } from "@/helpers";
import { fromDate, getLocalTimeZone } from "@internationalized/date";
import {
  Button,
  DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";

type EditItemStockModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
> & {
  selectedItem: ItemType;
};

export const EditItemStockModal = ({
  isOpen,
  onClose,
  onOpenChange,
  selectedItem,
}: EditItemStockModalProps) => {
  const [itemStockData, setItemStockData] = useState<ItemType>({
    id: selectedItem.id,
    itemName: selectedItem.itemName,
    itemType: selectedItem.itemType,
    partyName: selectedItem.partyName,
    requisitionBy: selectedItem.requisitionBy,
    quantity: selectedItem.quantity,
    rate: selectedItem.rate,
    purchaseDate: selectedItem.purchaseDate,
    issueDate: selectedItem.issueDate,
    totalPrice: selectedItem.totalPrice,
    remarks: selectedItem.remarks,
  });

  const [isSubmiting, setIsSubmiting] = useState(false);

  useEffect(() => {
    setItemStockData({
      id: selectedItem.id,
      itemName: selectedItem.itemName,
      itemType: selectedItem.itemType,
      partyName: selectedItem.partyName,
      requisitionBy: selectedItem.requisitionBy,
      quantity: selectedItem.quantity,
      rate: selectedItem.rate,
      purchaseDate: selectedItem.purchaseDate,
      issueDate: selectedItem.issueDate,
      totalPrice: selectedItem.totalPrice,
      remarks: selectedItem.remarks,
    });
  }, [selectedItem]);

  return (
    <>
      <Modal isOpen={isOpen} backdrop="blur" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Stock Item
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    label="Item Name"
                    className="w-full"
                    onChange={(e) => {
                      setItemStockData({
                        ...itemStockData,
                        itemName: e.target.value,
                      });
                    }}
                    value={itemStockData.itemName}
                    isRequired
                  />
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="py-7 w-1/2">
                        <span>
                          {itemStockData.itemType.length === 0
                            ? "Item Type"
                            : itemStockData.itemType}
                        </span>
                        <BiChevronDown />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      variant="flat"
                      aria-label="Dynamic Actions"
                      items={itemTypes}
                    >
                      {(item) => {
                        return (
                          <DropdownItem
                            onClick={() => {
                              setItemStockData({
                                ...itemStockData,
                                itemType: item.value,
                              });
                            }}
                            key={item.label}
                          >
                            {item.value}
                          </DropdownItem>
                        );
                      }}
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <div className="flex gap-3">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="py-7 w-1/2">
                        <span>
                          {itemStockData.partyName.length === 0
                            ? "Party Name"
                            : itemStockData.partyName}
                        </span>
                        <BiChevronDown />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      variant="flat"
                      aria-label="Dynamic Actions"
                      items={partyNames}
                    >
                      {(item) => {
                        return (
                          <DropdownItem
                            onClick={() => {
                              setItemStockData({
                                ...itemStockData,
                                partyName: item.value,
                              });
                            }}
                            key={item.label}
                          >
                            {item.value}
                          </DropdownItem>
                        );
                      }}
                    </DropdownMenu>
                  </Dropdown>
                  <Input
                    type="text"
                    label="Requisition By"
                    onChange={(e) => {
                      setItemStockData({
                        ...itemStockData,
                        requisitionBy: e.target.value,
                      });
                    }}
                    value={itemStockData.requisitionBy}
                    isRequired
                  />
                </div>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    label="Quantity"
                    onChange={(e) => {
                      setItemStockData({
                        ...itemStockData,
                        quantity: Number(e.target.value),
                        totalPrice: Number(e.target.value) * itemStockData.rate,
                      });
                    }}
                    value={itemStockData.quantity.toString()}
                    isRequired
                  />
                  <Input
                    type="number"
                    label="Rate"
                    onChange={(e) => {
                      setItemStockData({
                        ...itemStockData,
                        rate: Number(e.target.value),
                        totalPrice:
                          Number(e.target.value) * itemStockData.quantity,
                      });
                    }}
                    value={itemStockData.rate.toString()}
                    isRequired
                  />
                </div>
                <DatePicker
                  label="Purchase Date"
                  hideTimeZone
                  showMonthAndYearPickers
                  value={fromDate(
                    new Date(
                      (itemStockData?.purchaseDate?.seconds ?? 0) * 1000
                    ),
                    getLocalTimeZone()
                  )}
                  onChange={(e) => {
                    setItemStockData((value) => {
                      return {
                        ...value,
                        purchaseDate: convertDateToTimestamp(e.toDate()),
                      };
                    });
                  }}
                  isRequired
                />
                <DatePicker
                  label="Issue Date"
                  hideTimeZone
                  showMonthAndYearPickers
                  value={
                    itemStockData?.issueDate?.seconds
                      ? fromDate(
                          new Date(
                            (itemStockData?.issueDate?.seconds ?? 0) * 1000
                          ),
                          getLocalTimeZone()
                        )
                      : null
                  }
                  onChange={(e) => {
                    setItemStockData((value) => {
                      return {
                        ...value,
                        issueDate: convertDateToTimestamp(e.toDate()),
                      };
                    });
                  }}
                  isRequired
                />
                <Input
                  type="number"
                  label="Total Price"
                  contentEditable={false}
                  value={(
                    itemStockData.quantity * itemStockData.rate
                  ).toString()}
                  isRequired
                />
                <Input
                  type="text"
                  label="Remarks (Optional)"
                  onChange={(e) => {
                    setItemStockData({
                      ...itemStockData,
                      remarks: e.target.value,
                    });
                  }}
                  value={itemStockData.remarks}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={() => {
                    // updateItemIn(itemInData);
                  }}
                  className="w-full"
                  // isLoading={isSubmiting}
                  isDisabled={isSubmiting}
                >
                  Delete
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    setIsSubmiting(true);
                    updateItemStock(itemStockData).finally(() => {
                      setIsSubmiting(false);
                      onClose();
                    });
                  }}
                  className="w-full"
                  isDisabled={isSubmiting}
                  isLoading={isSubmiting}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
