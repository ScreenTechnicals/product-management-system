"use client";

import { ItemType } from "@/common/types";
import {
  EditItemStockModal,
  IssueItemStockModal,
  ItemsStockTable,
} from "@/components";
import { DeleteItemModal } from "@/components/delete-item-modal.component";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";

const ItemsStockPage = () => {
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
    onOpenChange: onOpenChangeEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenIssue,
    onOpen: onOpenIssue,
    onClose: onCloseIssue,
    onOpenChange: onOpenChangeIssue,
  } = useDisclosure();

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
    issueDate: undefined,
    stockRef: "",
    totalPrice: 0,
    remarks: "",
  });

  return (
    <div className="w-full md:px-10 p-5">
      <ItemsStockTable
        onOpenEditModal={onOpenEdit}
        onOpenIssueModal={onOpenIssue}
        setSelectedItem={setSelectedItem}
      />
      <EditItemStockModal
        isOpen={isOpenEdit}
        onOpenDelete={onOpenDelete}
        onClose={onCloseEdit}
        onOpenChange={onOpenChangeEdit}
        selectedItem={selectedItem}
      />
      <IssueItemStockModal
        isOpen={isOpenIssue}
        onClose={onCloseIssue}
        onOpenChange={onOpenChangeIssue}
        selectedItem={selectedItem}
      />
      <DeleteItemModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onOpenChange={onOpenChangeDelete}
        onCloseEdit={onCloseEdit}
        collection="items-stock"
        id={selectedItem.id}
      />
    </div>
  );
};

export default ItemsStockPage;
