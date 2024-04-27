"use client";

import { deleteItem } from "@/helpers";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { useState } from "react";

type DeleteItemModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
> & {
  id: string;
  collection: string;
  onCloseEdit: () => void;
};

export const DeleteItemModal = ({
  isOpen,
  onClose,
  onCloseEdit,
  onOpenChange,
  id,
  collection,
}: DeleteItemModalProps) => {
  const [isSubmiting, setIsSubmiting] = useState(false);

  return (
    <>
      <Modal
        placement="center"
        isOpen={isOpen}
        backdrop="blur"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ⚠️ Warning
              </ModalHeader>
              <ModalBody>
                <h1 className="p-0 m-0">
                  Are you sure you want to delete this item?
                </h1>
                <h2>
                  All other occurence of this in item are not going to be
                  deleted!
                </h2>
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={isSubmiting}
                  color="primary"
                  onPress={onClose}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  isDisabled={isSubmiting}
                  color="danger"
                  onPress={() => {
                    setIsSubmiting(true);
                    deleteItem(id, collection).finally(() => {
                      setIsSubmiting(false);
                      onClose();
                      onCloseEdit();
                    });
                  }}
                  className="w-full"
                  isLoading={isSubmiting}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
