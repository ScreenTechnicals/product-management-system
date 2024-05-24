"use client";

import { ItemType } from "@/common/types";
import { convertDateToTimestamp, issueItemStock } from "@/helpers";
import { fromDate, getLocalTimeZone } from "@internationalized/date";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

type EditItemStockModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
> & {
  selectedItem: ItemType;
};

export const IssueItemStockModal = ({
  isOpen,
  onClose,
  onOpenChange,
  selectedItem,
}: EditItemStockModalProps) => {
  const [itemStockData, setItemStockData] = useState<ItemType>({
    id: Date.now().toString(),
    itemName: selectedItem.itemName,
    itemType: selectedItem.itemType,
    partyName: selectedItem.partyName,
    requisitionBy: selectedItem.requisitionBy,
    quantity: selectedItem.quantity,
    rate: selectedItem.rate,
    purchaseDate: selectedItem.purchaseDate,
    issueDate: selectedItem.issueDate,
    stockRef: selectedItem.id,
    totalPrice: selectedItem.totalPrice,
    remarks: selectedItem.remarks,
  });

  const [isSubmiting, setIsSubmiting] = useState(false);

  const isDissabled =
    itemStockData.quantity > selectedItem.quantity ||
    itemStockData.rate > selectedItem.rate;

  useEffect(() => {
    setItemStockData({
      id: Date.now().toString(),
      itemName: selectedItem.itemName,
      itemType: selectedItem.itemType,
      partyName: selectedItem.partyName,
      requisitionBy: selectedItem.requisitionBy,
      quantity: selectedItem.quantity,
      rate: selectedItem.rate,
      purchaseDate: selectedItem.purchaseDate,
      issueDate: selectedItem.issueDate,
      stockRef: selectedItem.id,
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
                Issue Stock Item
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    label="Item Name"
                    className="w-full"
                    isReadOnly
                    isDisabled
                    value={itemStockData.itemName}
                    isRequired
                  />
                  <Input
                    type="text"
                    label="Item Type"
                    className="w-full"
                    isReadOnly
                    isDisabled
                    value={itemStockData.itemType}
                    isRequired
                  />
                </div>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    label="Party Name"
                    isReadOnly
                    isDisabled
                    value={itemStockData.partyName}
                    isRequired
                  />
                  <Input
                    type="text"
                    label="Requisition By"
                    isReadOnly
                    isDisabled
                    value={itemStockData.requisitionBy}
                    isRequired
                  />
                </div>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    label={`Quantity(Max: ${selectedItem.quantity})`}
                    max={itemStockData.quantity}
                    color={
                      itemStockData.quantity > selectedItem.quantity
                        ? "danger"
                        : "default"
                    }
                    isInvalid={itemStockData.quantity > selectedItem.quantity}
                    errorMessage={`Max Quantity: ${selectedItem.quantity}`}
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
                    startContent="₹"
                    isDisabled
                    color={
                      itemStockData.rate > selectedItem.rate
                        ? "danger"
                        : "default"
                    }
                    isReadOnly
                    value={itemStockData.rate.toString()}
                    isRequired
                  />
                </div>
                <DatePicker
                  label="Purchase Date"
                  isDisabled
                  hideTimeZone
                  showMonthAndYearPickers
                  value={fromDate(
                    new Date(
                      (itemStockData?.purchaseDate?.seconds ?? 0) * 1000
                    ),
                    getLocalTimeZone()
                  )}
                  isReadOnly
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
                  startContent="₹"
                  color={
                    itemStockData.rate > selectedItem.rate
                      ? "danger"
                      : "default"
                  }
                  isInvalid={itemStockData.totalPrice > selectedItem.totalPrice}
                  errorMessage={`Max Price can be: ₹ ${selectedItem.totalPrice}`}
                  value={(
                    itemStockData.quantity * itemStockData.rate
                  ).toString()}
                  isReadOnly
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
                  isReadOnly
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onPress={() => {
                    setIsSubmiting(true);
                    issueItemStock(itemStockData).finally(() => {
                      setIsSubmiting(false);
                      onClose();
                    });
                  }}
                  className="w-full"
                  isDisabled={isDissabled}
                  isLoading={isSubmiting}
                >
                  Issue Item
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
