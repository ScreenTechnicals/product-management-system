"use client";

import { LabelOptionType } from "@/common/types";
import { addNewParty } from "@/helpers/add-new-party.helper";
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

type AddItemModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
>;

export const AddNewPartNameModal = ({
  isOpen,
  onClose,
  onOpenChange,
}: AddItemModalProps) => {
  const [newPartyName, setNewPartyName] = useState<LabelOptionType>({
    label: "",
    value: "",
  });

  const [isSubmiting, setIsSubmiting] = useState(false);

  const isDisabledSubmit = newPartyName.label.trim().length === 0;

  const handleAddItem = () => {
    if (isDisabledSubmit) {
      toast.error("Please fill all the required fields.");
      return;
    }
    setIsSubmiting(true);
    addNewParty(newPartyName)
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
        setNewPartyName({
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
                Add New Party Name
              </ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  label="Enter new party name here"
                  onChange={(e) => {
                    setNewPartyName({
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
