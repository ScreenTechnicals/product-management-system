"use client";

import { CollectionNameType, ItemType, LabelOptionType } from "@/common/types";
import { auth } from "@/configs";
import { convertDateToTimestamp, updateItemStock } from "@/helpers";
import { useGetDropdownItems } from "@/hooks";
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { DropdownItems } from "./dropdown-items.component";

type EditItemStockModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
> & {
  selectedItem: ItemType;
  onOpenDelete: () => void;
  onOpenAddDropdownItemModal: Dispatch<SetStateAction<void>>;
  onOpenEditDropdownItemModal: Dispatch<SetStateAction<void>>;
  setSelectedDropdownItem: Dispatch<SetStateAction<LabelOptionType>>;
  setCollectionName: Dispatch<SetStateAction<CollectionNameType>>;
};

export const EditItemStockModal = ({
  isOpen,
  onClose,
  onOpenChange,
  onOpenDelete,
  selectedItem,
  onOpenAddDropdownItemModal,
  onOpenEditDropdownItemModal,
  setSelectedDropdownItem,
  setCollectionName,
}: EditItemStockModalProps) => {
  const [user] = useAuthState(auth);

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

  const { data: itemsName } = useGetDropdownItems("items-name");
  const { data: itemsType } = useGetDropdownItems("items-type");
  const { data: partyNames } = useGetDropdownItems("party-names");
  const { data: requisiotionsBy } = useGetDropdownItems("requisitions-by");

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
                  <DropdownItems
                    dropdownType={"item_Name"}
                    itemData={itemStockData}
                    setItemData={setItemStockData}
                    items={itemsName}
                    collectionName="items-name"
                    setCollectionName={setCollectionName}
                    setSelectedDropdownItem={setSelectedDropdownItem}
                    onOpenAddDropdownItemModal={onOpenAddDropdownItemModal}
                    onOpenEditDropdownItemModal={onOpenEditDropdownItemModal}
                  />
                
                </div>
                <div className="flex gap-3">
                  <DropdownItems
                    dropdownType={"party_Name"}
                    itemData={itemStockData}
                    setItemData={setItemStockData}
                    items={partyNames}
                    collectionName="party-names"
                    setCollectionName={setCollectionName}
                    setSelectedDropdownItem={setSelectedDropdownItem}
                    onOpenAddDropdownItemModal={onOpenAddDropdownItemModal}
                    onOpenEditDropdownItemModal={onOpenEditDropdownItemModal}
                  />
                  <DropdownItems
                    dropdownType={"requisition_By"}
                    itemData={itemStockData}
                    setItemData={setItemStockData}
                    items={requisiotionsBy}
                    collectionName="requisitions-by"
                    setCollectionName={setCollectionName}
                    setSelectedDropdownItem={setSelectedDropdownItem}
                    onOpenAddDropdownItemModal={onOpenAddDropdownItemModal}
                    onOpenEditDropdownItemModal={onOpenEditDropdownItemModal}
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
                    onOpenDelete();
                  }}
                  className="w-full"
                  isDisabled={isSubmiting}
                >
                  Delete
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (!user) return;
                    setIsSubmiting(true);
                    updateItemStock(itemStockData, user.uid).finally(() => {
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
