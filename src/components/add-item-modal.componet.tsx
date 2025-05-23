"use client";

import { CollectionNameType, ItemType, LabelOptionType } from "@/common/types";
import { auth } from "@/configs";
import { AddItemIn, convertDateToTimestamp } from "@/helpers";
import { useGetDropdownItems } from "@/hooks";
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
import { Dispatch, SetStateAction, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { DropdownItems } from "./dropdown-items.component";

type AddItemModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
> & {
  onOpenAddDropdownItemModal: Dispatch<SetStateAction<void>>;
  onOpenEditDropdownItemModal: Dispatch<SetStateAction<void>>;
  setSelectedDropdownItem: Dispatch<SetStateAction<LabelOptionType>>;
  setCollectionName: Dispatch<SetStateAction<CollectionNameType>>;
};

export const AddItemModal = ({
  isOpen,
  onClose,
  onOpenChange,
  onOpenAddDropdownItemModal,
  onOpenEditDropdownItemModal,
  setSelectedDropdownItem,
  setCollectionName,
}: AddItemModalProps) => {
  const [user] = useAuthState(auth);

  const [itemInData, setItemInData] = useState<ItemType>({
    id: Date.now().toString(),
    itemName: "",
    itemType: "",
    partyName: "",
    requisitionBy: "",
    quantity: 0,
    rate: 0,
    purchaseDate: undefined,
    totalPrice: 0,
    remarks: "",
  });

  const { data: itemsName } = useGetDropdownItems("items-name");
  const { data: itemsType } = useGetDropdownItems("items-type");
  const { data: partyNames } = useGetDropdownItems("party-names");
  const { data: requisiotionsBy } = useGetDropdownItems("requisitions-by");

  const [isSubmiting, setIsSubmiting] = useState(false);

  const isDisabledSubmit =
    itemInData.itemName.trim().length === 0 ||
    itemInData.itemType.trim().length === 0 ||
    itemInData.partyName.trim().length === 0 ||
    itemInData.requisitionBy.trim().length === 0 ||
    itemInData.purchaseDate === null ||
    itemInData.quantity === 0 ||
    itemInData.rate === 0 ||
    itemInData.totalPrice === 0;

  const handleAddItem = () => {
    if (!user) return;

    if (isDisabledSubmit) {
      toast.error("Please fill all the required fields.");
      return;
    }
    setIsSubmiting(true);
    AddItemIn(itemInData, user.uid)
      .then((res) => {
        if (res) {
          toast.success("Item Added Successfully");
        } else {
          toast.error("Something Went Wrong! Please try again.");
        }
      })
      .catch((error) => {
        toast.error("Something Went Wrong! Please try again.");
      })
      .finally(() => {
        setIsSubmiting(false);
        onClose?.();
        setItemInData({
          id: Date.now().toString(),
          itemName: "",
          itemType: "",
          partyName: "",
          requisitionBy: "",
          quantity: 0,
          rate: 0,
          purchaseDate: undefined,
          totalPrice: 0,
          remarks: "",
        });
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} backdrop="blur" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Item
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
                    isRequired
                  />
                  <Input
                    type="number"
                    label="Rate"
                    startContent="₹"
                    onChange={(e) => {
                      setItemInData({
                        ...itemInData,
                        rate: Number(e.target.value),
                        totalPrice:
                          Number(e.target.value) * itemInData.quantity,
                      });
                    }}
                    isRequired
                  />
                </div>
                <DatePicker
                  label="Purchase Date"
                  onChange={(e) => {
                    setItemInData((value) => {
                      return {
                        ...value,
                        purchaseDate: convertDateToTimestamp(
                          e.toDate(
                            Intl.DateTimeFormat().resolvedOptions().timeZone
                          )
                        ),
                      };
                    });
                  }}
                  isRequired
                />
                <Input
                  type="number"
                  label="Total Price"
                  startContent="₹"
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
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={isDisabledSubmit}
                  color="primary"
                  onPress={handleAddItem}
                  className="w-full"
                  isLoading={isSubmiting}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
