import {
  CollectionNameType,
  DropdownType,
  ItemType,
  LabelOptionType,
} from "@/common/types";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";
import { BiChevronDown } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { twMerge } from "tailwind-merge";

type DropdownItemsProps = {
  itemData: ItemType;
  setItemData: Dispatch<SetStateAction<ItemType>>;
  items: LabelOptionType[];
  collectionName: CollectionNameType;
  setCollectionName: Dispatch<SetStateAction<CollectionNameType>>;
  setSelectedDropdownItem: Dispatch<SetStateAction<LabelOptionType>>;
  onOpenAddDropdownItemModal: Dispatch<SetStateAction<void>>;
  onOpenEditDropdownItemModal: Dispatch<SetStateAction<void>>;
  dropdownType: "party_Name" | "item_Type" | "item_Name" | "requisition_By";
};

export const DropdownItems = ({
  itemData,
  setItemData,
  items,
  collectionName,
  setCollectionName,
  setSelectedDropdownItem,
  onOpenAddDropdownItemModal,
  onOpenEditDropdownItemModal,
  dropdownType,
}: DropdownItemsProps) => {
  const itemDataKey = dropdownType.replace("_", "") as DropdownType;
  const data = itemData[itemDataKey];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="py-7 w-1/2">
          <span className="capitalize">
            {data.length === 0 ? dropdownType.replace("_", " ") : data}
          </span>
          <BiChevronDown />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="flat" aria-label="Dynamic Actions" items={items}>
        {(item) => {
          return (
            <DropdownItem
              onClick={() => {
                if (item.label === "add_new") {
                  setCollectionName(collectionName);
                  onOpenAddDropdownItemModal();
                  return;
                }
                setItemData((value) => {
                  return {
                    ...value,
                    [itemDataKey]: item.value,
                  };
                });
              }}
              key={item.label}
              className={twMerge(
                item.label === "add_new" && "bg-success-500 text-white"
              )}
              endContent={
                item.label !== "add_new" && (
                  <Button
                    isIconOnly
                    radius="full"
                    variant="flat"
                    size="sm"
                    color="secondary"
                    onPress={() => {
                      setSelectedDropdownItem(item);
                      onOpenEditDropdownItemModal();
                    }}
                  >
                    <MdEdit />
                  </Button>
                )
              }
            >
              {item.value}
            </DropdownItem>
          );
        }}
      </DropdownMenu>
    </Dropdown>
  );
};
