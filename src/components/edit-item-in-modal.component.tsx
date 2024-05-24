"use client";

import { CollectionNameType, ItemType, LabelOptionType } from "@/common/types";
import { auth } from "@/configs";
import { convertDateToTimestamp, updateItemIn } from "@/helpers";
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

type EditItemInModalProps = Pick<
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

export const EditItemInModal = ({
  isOpen,
  onClose,
  onOpenDelete,
  onOpenChange,
  selectedItem,
  onOpenAddDropdownItemModal,
  onOpenEditDropdownItemModal,
  setSelectedDropdownItem,
  setCollectionName,
}: EditItemInModalProps) => {
  const [user] = useAuthState(auth);

  const [itemInData, setItemInData] = useState<ItemType>({
    id: selectedItem.id,
    itemName: selectedItem.itemName,
    itemType: selectedItem.itemType,
    partyName: selectedItem.partyName,
    requisitionBy: selectedItem.requisitionBy,
    quantity: selectedItem.quantity,
    rate: selectedItem.rate,
    purchaseDate: selectedItem.issueDate,
    totalPrice: selectedItem.totalPrice,
    remarks: selectedItem.remarks,
  });

  const [isSubmiting, setIsSubmiting] = useState(false);

  useEffect(() => {
    setItemInData({
      id: selectedItem.id,
      itemName: selectedItem.itemName,
      itemType: selectedItem.itemType,
      partyName: selectedItem.partyName,
      requisitionBy: selectedItem.requisitionBy,
      quantity: selectedItem.quantity,
      rate: selectedItem.rate,
      purchaseDate: selectedItem.purchaseDate ?? undefined,
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
                Edit Item
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3">
                  <DropdownItems
                    dropdownType={"item_Name"}
                    itemData={itemInData}
                    setItemData={setItemInData}
                    items={itemsName}
                    collectionName="items-name"
                    setCollectionName={setCollectionName}
                    setSelectedDropdownItem={setSelectedDropdownItem}
                    onOpenAddDropdownItemModal={onOpenAddDropdownItemModal}
                    onOpenEditDropdownItemModal={onOpenEditDropdownItemModal}
                  />
                  <DropdownItems
                    dropdownType={"item_Type"}
                    itemData={itemInData}
                    setItemData={setItemInData}
                    items={itemsType}
                    collectionName="items-type"
                    setCollectionName={setCollectionName}
                    setSelectedDropdownItem={setSelectedDropdownItem}
                    onOpenAddDropdownItemModal={onOpenAddDropdownItemModal}
                    onOpenEditDropdownItemModal={onOpenEditDropdownItemModal}
                  />
                </div>
                <div className="flex gap-3">
                  <DropdownItems
                    dropdownType={"party_Name"}
                    itemData={itemInData}
                    setItemData={setItemInData}
                    items={partyNames}
                    collectionName="party-names"
                    setCollectionName={setCollectionName}
                    setSelectedDropdownItem={setSelectedDropdownItem}
                    onOpenAddDropdownItemModal={onOpenAddDropdownItemModal}
                    onOpenEditDropdownItemModal={onOpenEditDropdownItemModal}
                  />
                  <DropdownItems
                    dropdownType={"requisition_By"}
                    itemData={itemInData}
                    setItemData={setItemInData}
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
                      setItemInData({
                        ...itemInData,
                        quantity: Number(e.target.value),
                        totalPrice: Number(e.target.value) * itemInData.rate,
                      });
                    }}
                    value={itemInData.quantity.toString()}
                    isRequired
                  />
                  <Input
                    type="number"
                    label="Rate"
                    onChange={(e) => {
                      setItemInData({
                        ...itemInData,
                        rate: Number(e.target.value),
                        totalPrice:
                          Number(e.target.value) * itemInData.quantity,
                      });
                    }}
                    value={itemInData.rate.toString()}
                    isRequired
                  />
                </div>
                <DatePicker
                  label="Purchase Date"
                  hideTimeZone
                  showMonthAndYearPickers
                  timeInputProps={{}}
                  value={fromDate(
                    new Date((itemInData?.purchaseDate?.seconds ?? 0) * 1000),
                    getLocalTimeZone()
                  )}
                  onChange={(e) => {
                    setItemInData((value) => {
                      return {
                        ...value,
                        purchaseDate: convertDateToTimestamp(e.toDate()),
                      };
                    });
                  }}
                  isRequired
                />
                <Input
                  type="number"
                  label="Total Price"
                  contentEditable={false}
                  value={(itemInData.quantity * itemInData.rate).toString()}
                  isRequired
                />
                <Input
                  type="text"
                  label="Remarks (Optional)"
                  onChange={(e) => {
                    setItemInData({
                      ...itemInData,
                      remarks: e.target.value,
                    });
                  }}
                  value={itemInData.remarks}
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
                    updateItemIn(itemInData, user.uid).finally(() => {
                      setIsSubmiting(false);
                      onClose();
                    });
                  }}
                  isDisabled={isSubmiting}
                  className="w-full"
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
