"use client";

import { ItemType } from "@/common/types";
import { EditItemInModal, ItemsInTable } from "@/components";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";

const ItemsInPage = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
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
    <div className="w-full md:px-10 p-5">
      <ItemsInTable onOpenModal={onOpen} setSelectedItem={setSelectedItem} />
      <EditItemInModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default ItemsInPage;
