"use client";

import { ItemType } from "@/common/types";
import { sendOutItemToStockItem, updateItemOut } from "@/helpers";
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

type EditItemOutModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
> & {
  selectedItem: ItemType;
};

export const EditItemOutModal = ({
  isOpen,
  onClose,
  onOpenChange,
  selectedItem,
}: EditItemOutModalProps) => {
  const [itemOutData, setItemOutData] = useState<ItemType>({
    id: selectedItem.id,
    itemName: selectedItem.itemName,
    itemType: selectedItem.itemType,
    partyName: selectedItem.partyName,
    requisitionBy: selectedItem.requisitionBy,
    quantity: selectedItem.quantity,
    rate: selectedItem.rate,
    purchaseDate: selectedItem.purchaseDate,
    issueDate: selectedItem.issueDate,
    stockRef: selectedItem?.stockRef,
    totalPrice: selectedItem.totalPrice,
    remarks: selectedItem.remarks,
  });

  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isSendingBack, setIsSendingBack] = useState(false);

  const isDissabled =
    itemOutData.quantity > selectedItem.quantity ||
    itemOutData.rate > selectedItem.rate ||
    isSubmiting ||
    isSendingBack;

  useEffect(() => {
    setItemOutData({
      id: selectedItem.id,
      itemName: selectedItem.itemName,
      itemType: selectedItem.itemType,
      partyName: selectedItem.partyName,
      requisitionBy: selectedItem.requisitionBy,
      quantity: selectedItem.quantity,
      rate: selectedItem.rate,
      purchaseDate: selectedItem.purchaseDate,
      issueDate: selectedItem.issueDate,
      stockRef: selectedItem?.stockRef,
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
                Edit Remarks
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    label="Item Name"
                    className="w-full"
                    isReadOnly
                    isDisabled
                    value={itemOutData.itemName}
                    isRequired
                  />
                  <Input
                    type="text"
                    label="Item Type"
                    className="w-full"
                    isReadOnly
                    isDisabled
                    value={itemOutData.itemType}
                    isRequired
                  />
                </div>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    label="Party Name"
                    isReadOnly
                    isDisabled
                    value={itemOutData.partyName}
                    isRequired
                  />
                  <Input
                    type="text"
                    label="Requisition By"
                    isReadOnly
                    isDisabled
                    value={itemOutData.requisitionBy}
                    isRequired
                  />
                </div>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    label={`Quantity(Max: ${selectedItem.quantity})`}
                    max={itemOutData.quantity}
                    color={
                      itemOutData.quantity > selectedItem.quantity
                        ? "danger"
                        : "default"
                    }
                    isInvalid={itemOutData.quantity > selectedItem.quantity}
                    errorMessage={`Max Quantity: ${selectedItem.quantity}`}
                    value={itemOutData.quantity.toString()}
                    onChange={(e) => {
                      setItemOutData({
                        ...itemOutData,
                        quantity: Number(e.target.value),
                        totalPrice: Number(e.target.value) * itemOutData.rate,
                      });
                    }}
                    isRequired
                  />
                  <Input
                    type="number"
                    label="Rate"
                    startContent="₹"
                    isReadOnly
                    isDisabled
                    value={itemOutData.rate.toString()}
                    isRequired
                  />
                </div>
                <DatePicker
                  label="Purchase Date"
                  isDisabled
                  hideTimeZone
                  showMonthAndYearPickers
                  value={fromDate(
                    new Date((itemOutData?.purchaseDate?.seconds ?? 0) * 1000),
                    getLocalTimeZone()
                  )}
                  isReadOnly
                  isRequired
                />
                <DatePicker
                  label="Issue Date"
                  isDisabled
                  hideTimeZone
                  showMonthAndYearPickers
                  value={
                    itemOutData?.issueDate?.seconds
                      ? fromDate(
                          new Date(
                            (itemOutData?.issueDate?.seconds ?? 0) * 1000
                          ),
                          getLocalTimeZone()
                        )
                      : null
                  }
                  isReadOnly
                  isRequired
                />
                <Input
                  type="number"
                  label="Total Price"
                  contentEditable={false}
                  startContent="₹"
                  color={
                    itemOutData.rate > selectedItem.rate ? "danger" : "default"
                  }
                  value={(itemOutData.quantity * itemOutData.rate).toString()}
                  isReadOnly
                  isRequired
                />
                <Input
                  type="text"
                  label="Remarks (Optional)"
                  onChange={(e) => {
                    setItemOutData({
                      ...itemOutData,
                      remarks: e.target.value,
                    });
                  }}
                  value={itemOutData.remarks}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onPress={() => {
                    setIsSendingBack(true);
                    sendOutItemToStockItem(itemOutData).finally(() => {
                      setIsSendingBack(false);
                      onClose();
                    });
                  }}
                  className="w-full"
                  isDisabled={isDissabled}
                  isLoading={isSendingBack}
                >
                  Send Back To Stock
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    setIsSubmiting(true);
                    updateItemOut(itemOutData).finally(() => {
                      setIsSubmiting(false);
                      onClose();
                    });
                  }}
                  className="w-full"
                  isDisabled={isDissabled}
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
