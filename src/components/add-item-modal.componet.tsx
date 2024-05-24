"use client";

import { itemTypes } from "@/common/consts";
import { ItemType, LabelOptionType } from "@/common/types";
import { db } from "@/configs";
import { AddItemIn, convertDateToTimestamp } from "@/helpers";
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
import { collection, orderBy, query } from "firebase/firestore";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";
import { BiChevronDown } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { twMerge } from "tailwind-merge";

type AddItemModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
> & {
  onOpenNewPartyModal: Dispatch<SetStateAction<void>>;
  onOpenEditPartyModal: Dispatch<SetStateAction<void>>;
  setSelectedPartyName: Dispatch<SetStateAction<LabelOptionType>>;
};

export const AddItemModal = ({
  isOpen,
  onClose,
  onOpenChange,
  onOpenNewPartyModal,
  onOpenEditPartyModal,
  setSelectedPartyName,
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
  const partyNamesRef = collection(db, "party-names");
  const queryPartyNames = query(partyNamesRef, orderBy("value"));
  const [partyNameSnapshots, isLoadingPartyNameSpanshots] =
    useCollectionData(queryPartyNames);

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
                  <Input
                    type="text"
                    label="Item Name"
                    className="w-full"
                    onChange={(e) => {
                      setItemInData({
                        ...itemInData,
                        itemName: e.target.value,
                      });
                    }}
                    isRequired
                  />
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="py-7 w-1/2">
                        <span>
                          {itemInData.itemType.length === 0
                            ? "Item Type"
                            : itemInData.itemType}
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
                              setItemInData({
                                ...itemInData,
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
                          {itemInData.partyName.length === 0
                            ? "Party Name"
                            : itemInData.partyName}
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
                              if (item.label === "add_new") {
                                onOpenNewPartyModal();
                                return;
                              }
                              setItemInData({
                                ...itemInData,
                                partyName: item.value,
                              });
                            }}
                            key={item.label}
                            className={twMerge(
                              item.label === "add_new" &&
                                "bg-success-500 text-white"
                            )}
                            endContent={
                              item.label !== "add_new" && (
                                <Button
                                  isIconOnly
                                  radius="full"
                                  variant="flat"
                                  size="sm"
                                  color="secondary"
                                  onPress={() => {
                                    setSelectedPartyName(item);
                                    onOpenEditPartyModal();
                                  }}
                                >
                                  <MdEdit />
                                </Button>
                              )
                            }
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
                      setItemInData({
                        ...itemInData,
                        requisitionBy: e.target.value,
                      });
                    }}
                    isRequired
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
