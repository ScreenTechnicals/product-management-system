"use client";

import { CollectionNameType, LabelOptionType } from "@/common/types";
import { addNewDropDownItem } from "@/helpers/add-drop-down-item.helper";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";

type AddNewItemToDropDownModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
> & {
  collectionName: CollectionNameType;
};

export const AddNewItemToDropDownModal = ({
  isOpen,
  onClose,
  onOpenChange,
  collectionName,
}: AddNewItemToDropDownModalProps) => {
  const [dropdownItem, setDropdownItem] = useState<LabelOptionType>({
    label: "",
    value: "",
  });

  const [isSubmiting, setIsSubmiting] = useState(false);

  const isDisabledSubmit = dropdownItem.label.trim().length === 0;

  const handleAddItem = () => {
    if (isDisabledSubmit) {
      toast.error("Please fill all the required fields.");
      return;
    }
    setIsSubmiting(true);
    addNewDropDownItem(dropdownItem, collectionName)
      .then((res) => {
        if (res) {
          setIsSubmiting(false);
          toast.success("New Party Added Successfully");
        }
      })
      .catch((error) => {
        setIsSubmiting(false);
        toast.error("Something Went Wrong! Please try again.");
      })
      .finally(() => {
        setIsSubmiting(false);
        onClose?.();
        setDropdownItem({
          label: "",
          value: "",
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
                Add new Item to the {collectionName}
              </ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  label="Enter new party name here"
                  onChange={(e) => {
                    setDropdownItem({
                      label: Date.now().toString(),
                      value: e.target.value,
                    });
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={isDisabledSubmit}
                  color="success"
                  onPress={handleAddItem}
                  className="w-full"
                  isLoading={isSubmiting}
                >
                  Add New
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
