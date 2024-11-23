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
        rence of this in item are not going to be
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
                  onPress={() => {dfdfdf
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
      </M
    </>
  );
};
