"use client";

import { ItemType } from "@/common/types";
import { EditItemOutModal } from "@/components";
import { ItemsOutTable } from "@/components/items-out-table.component";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";

const ItemsOutPage = () => {
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
    onOpenChange: onOpenChangeEdit,
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
    issueDate: undefined,
    stockRef: "",
    totalPrice: 0,
    remarks: "",
  });

  return (
    <div className="w-full md:px-10 p-5">
      <ItemsOutTable
        onOpenEditModal={onOpenEdit}
        onOpenIssueModal={onOpenEdit}
        setSelectedItem={setSelectedItem}
      />
      <EditItemOutModal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        onOpenChange={onOpenChangeEdit}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default ItemsOutPage;
