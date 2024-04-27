"use client";

import { ItemType } from "@/common/types";
import { EditItemInModal, ItemsInTable } from "@/components";
import { DeleteItemModal } from "@/components/delete-item-modal.component";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";

const ItemsInPage = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<ItemType>({
    id: "",
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

  return (
    <div className="w-full md:px-10 p-5 relative">
      <ItemsInTable onOpenModal={onOpen} setSelectedItem={setSelectedItem} />
      <EditItemInModal
        isOpen={isOpen}
        onOpenDelete={onOpenDelete}
        onClose={onClose}
        onOpenChange={onOpenChange}
        selectedItem={selectedItem}
      />
      <DeleteItemModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onOpenChange={onOpenChangeDelete}
        onCloseEdit={onClose}
        collection="items-in"
        id={selectedItem.id}
      />
    </div>
  );
};

export default ItemsInPage;
