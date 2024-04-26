"use client";

import { itemTypes } from "@/common/consts";
import { partyNames } from "@/common/consts/party-names.consts";
import { ItemType } from "@/common/types";
import { AddItemIn, convertDateToTimestamp } from "@/helpers";
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
import toast from "react-hot-toast";
import { BiChevronDown } from "react-icons/bi";

type EditItemInModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
> & {
  selectedItem: ItemType;
};

export const EditItemInModal = ({
  isOpen,
  onClose,
  onOpenChange,
  selectedItem,
}: EditItemInModalProps) => {
  const [itemInData, setItemInData] = useState<ItemType>({
    id: selectedItem.id.toUpperCase(),
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
          id: "in-" + Date.now().toString(),
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

  useEffect(() => {
    setItemInData({
      id: selectedItem.id.toUpperCase(),
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
    if (selectedItem.purchaseDate) {
      // new Intl.DateTimeFormat('sv-SE', {timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short'}).format(new Date())
      console.log(
        // selectedItem.purchaseDate,
        fromDate(
          new Date(selectedItem.purchaseDate.seconds * 1000),
          getLocalTimeZone()
        )
      );
    }
  }, [selectedItem]);

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
                    value={itemInData.itemName}
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
                              setItemInData({
                                ...itemInData,
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
                      setItemInData({
                        ...itemInData,
                        requisitionBy: e.target.value,
                      });
                    }}
                    value={itemInData.requisitionBy}
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
