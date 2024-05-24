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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type EditDropdownItemModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
> & {
  dropdownItem: LabelOptionType;
  collectionName: CollectionNameType;
};

export const EditDropdownItemModal = ({
  isOpen,
  onClose,
  onOpenChange,
  dropdownItem,
  collectionName,
}: EditDropdownItemModalProps) => {
  const [updatedDropdownItem, setUpdatedDropdownItem] =
    useState<LabelOptionType>({
      label: dropdownItem.label,
      value: dropdownItem.value,
    });

  const [isSubmiting, setIsSubmiting] = useState(false);

  const isDisabledSubmit =
    updatedDropdownItem.label.trim().length === 0 ||
    dropdownItem === updatedDropdownItem;

  const handleAddItem = () => {
    if (isDisabledSubmit) {
      toast.error("Please fill all the required fields.");
      return;
    }
    setIsSubmiting(true);
    addNewDropDownItem(updatedDropdownItem, collectionName)
      .then((res) => {
        if (res) {
          setIsSubmiting(false);
          toast.success("Party Updated Successfully");
        }
      })
      .catch((error) => {
        setIsSubmiting(false);
        toast.error("Something Went Wrong! Please try again.");
      })
      .finally(() => {
        setIsSubmiting(false);
        onClose?.();
        setUpdatedDropdownItem({
          label: "",
          value: "",
        });
      });
  };

  useEffect(() => {
    setUpdatedDropdownItem(dropdownItem);
  }, [dropdownItem]);
  return (
    <>
      <Modal isOpen={isOpen} backdrop="blur" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit the item in {collectionName}
              </ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  label="Enter new party name here"
                  value={updatedDropdownItem.value}
                  onChange={(e) => {
                    setUpdatedDropdownItem({
                      label: dropdownItem.label,
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
