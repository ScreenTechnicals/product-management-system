"use client";

import { CollectionNameType, ItemType, LabelOptionType } from "@/common/types";
import { db } from "@/configs";
import { AddItemIn, convertDateToTimestamp } from "@/helpers";
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
import { collection, orderBy, query } from "firebase/firestore";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
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

  const itemsNameRef = collection(db, "items-name");
  const queryItemsName = query(itemsNameRef, orderBy("value"));
  const [itemsNameSnapshots, isLoadingItemsNameSpanshots] =
    useCollectionData(queryItemsName);

  const itemsTypeRef = collection(db, "items-type");
  const queryItemsType = query(itemsTypeRef, orderBy("value"));
  const [itemsTypeSnapshots, isLoadingItemsTypeSpanshots] =
    useCollectionData(queryItemsType);

  const partyNamesRef = collection(db, "party-names");
  const queryPartyNames = query(partyNamesRef, orderBy("value"));
  const [partyNameSnapshots, isLoadingPartyNameSpanshots] =
    useCollectionData(queryPartyNames);

  const requisitionByRef = collection(db, "requisitions-by");
  const queryRequisitionBy = query(requisitionByRef, orderBy("value"));
  const [requisitionBySnapshots, isLoadingRequisitionBy] =
    useCollectionData(queryRequisitionBy);

  const itemsName = useMemo(() => {
    let localItemNames: LabelOptionType[] = [
      {
        label: "add_new",
        value: "Add New",
      },
    ];
    if (!isLoadingItemsNameSpanshots) {
      itemsNameSnapshots?.forEach((item) => {
        localItemNames.push(item as LabelOptionType);
      });
    }
    return localItemNames;
  }, [isLoadingItemsNameSpanshots, itemsNameSnapshots]);

  const itemsType = useMemo(() => {
    let localItemTypes: LabelOptionType[] = [
      {
        label: "add_new",
        value: "Add New",
      },
    ];
    if (!isLoadingItemsTypeSpanshots) {
      itemsTypeSnapshots?.forEach((item) => {
        localItemTypes.push(item as LabelOptionType);
      });
    }
    return localItemTypes;
  }, [isLoadingItemsTypeSpanshots, itemsTypeSnapshots]);

  const partyNames = useMemo(() => {
    let localPartyNames: LabelOptionType[] = [
      {
        label: "add_new",
        value: "Add New",
      },
    ];
    if (!isLoadingPartyNameSpanshots) {
      partyNameSnapshots?.forEach((item) => {
        localPartyNames.push(item as LabelOptionType);
      });
    }
    return localPartyNames;
  }, [isLoadingPartyNameSpanshots, partyNameSnapshots]);

  const requisiotionsBy = useMemo(() => {
    let localRequisiotionsBy: LabelOptionType[] = [
      {
        label: "add_new",
        value: "Add New",
      },
    ];
    if (!isLoadingRequisitionBy) {
      requisitionBySnapshots?.forEach((item) => {
        localRequisiotionsBy.push(item as LabelOptionType);
      });
    }
    return localRequisiotionsBy;
  }, [isLoadingRequisitionBy, requisitionBySnapshots]);

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
    if (isDisabledSubmit) {
      toast.error("Please fill all the required fields.");
      return;
    }
    setIsSubmiting(true);
    AddItemIn(itemInData)
      .then((res) => {
        if (res) {
          setIsSubmiting(false);
          toast.success("Item Added Successfully");
        }
      })
      .catch((error) => {
        setIsSubmiting(false);
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
