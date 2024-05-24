"use client";

import { CollectionNameType, ItemType, LabelOptionType } from "@/common/types";
import {
  AddNewItemToDropDownModal,
  EditDropdownItemModal,
  EditItemInModal,
  ItemsInTable,
} from "@/components";
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

  const {
    isOpen: isOpenAddDropdownItemModal,
    onOpen: onOpenAddDropdownItemModal,
    onOpenChange: onOpenChangeAddDropdownItemModal,
    onClose: onCloseAddDropdownItemModal,
  } = useDisclosure();
  const {
    isOpen: isOpenEditDropdownItemModal,
    onOpen: onOpenEditDropdownItemModal,
    onOpenChange: onOpenChangeEditDropdownItemModal,
    onClose: onCloseEditDropdownItemModal,
  } = useDisclosure();
  const [selectedDropDownItem, setSelectedDropDownItem] =
    useState<LabelOptionType>({
      label: "",
      value: "",
    });
  const [collectionName, setCollectionName] = useState<CollectionNameType>();

  return (
    <div className="w-full md:px-10 p-5 relative">
      <ItemsInTable onOpenModal={onOpen} setSelectedItem={setSelectedItem} />
      <EditItemInModal
        isOpen={isOpen}
        onOpenDelete={onOpenDelete}
        onClose={onClose}
        onOpenChange={onOpenChange}
        selectedItem={selectedItem}
        onOpenAddDropdownItemModal={onOpenAddDropdownItemModal}
        onOpenEditDropdownItemModal={onOpenEditDropdownItemModal}
        setSelectedDropdownItem={setSelectedDropDownItem}
        setCollectionName={setCollectionName}
      />
      <DeleteItemModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onOpenChange={onOpenChangeDelete}
        onCloseEdit={onClose}
        collection="items-in"
        id={selectedItem.id}
      />
      <AddNewItemToDropDownModal
        isOpen={isOpenAddDropdownItemModal}
        onClose={onCloseAddDropdownItemModal}
        onOpenChange={onOpenChangeAddDropdownItemModal}
        collectionName={collectionName}
      />
      <EditDropdownItemModal
        isOpen={isOpenEditDropdownItemModal}
        onClose={onCloseEditDropdownItemModal}
        onOpenChange={onOpenChangeEditDropdownItemModal}
        dropdownItem={selectedDropDownItem}
        collectionName={collectionName}
      />
    </div>
  );
};

export default ItemsInPage;
