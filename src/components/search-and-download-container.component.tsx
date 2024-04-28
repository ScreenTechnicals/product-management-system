import { SearchFilterType } from "@/common/types";
import { convertDateToTimestamp } from "@/helpers";
import {
  Button,
  DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { Timestamp } from "firebase/firestore";
import { useEffect } from "react";
import { IoFilter, IoSearch } from "react-icons/io5";
import { SiMicrosoftexcel } from "react-icons/si";

type SearchAndDownloadContainerProps = {
  itemsDataSanpshots: any;
  selectedFilterOption: any;
  searchFilters: SearchFilterType[];
  searchValue: string;
  setSearchValue: (value: any) => void;
  setSelectedFilterOption: (value: any) => void;
  setSelectedFilterValue: (value: string | Timestamp) => void;
  onOpenDownloadModal: () => void;
};

export const SearchAndDownloadContainer = ({
  itemsDataSanpshots: itemsInDataSanpshots,
  selectedFilterOption,
  searchFilters,
  searchValue,
  setSearchValue,
  setSelectedFilterOption,
  setSelectedFilterValue,
  onOpenDownloadModal,
}: SearchAndDownloadContainerProps) => {
  useEffect(() => {
    if (searchValue === "") {
      setSelectedFilterValue("");
    }
  }, [searchValue]);

  return (
    <div className="flex items-center justify-between gap-2 md:gap-5 bg-white p-3 rounded-xl shadow-sm">
      <Button
        variant="flat"
        className="md:flex hidden"
        onClick={onOpenDownloadModal}
        color="success"
        startContent={<SiMicrosoftexcel size={20} />}
      >
        Download Excel
      </Button>
      <div className="flex items-center gap-2 md:gap-5 md:w-1/2 w-full">
        {selectedFilterOption.type !== "date" ? (
          <Input
            type={selectedFilterOption.type}
            placeholder={`Search By ${selectedFilterOption.value}`}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            value={searchValue.toString()}
            variant="flat"
            endContent={
              <Button
                variant="light"
                className="relative left-2 text-black"
                onClick={() => {
                  setSelectedFilterValue(searchValue);
                }}
                isIconOnly
              >
                <IoSearch />
              </Button>
            }
          />
        ) : (
          <div className="w-full flex items-center">
            <DatePicker
              className="w-full"
              onChange={(e) => {
                setSearchValue(
                  e.toDate(Intl.DateTimeFormat().resolvedOptions().timeZone)
                );
                setSelectedFilterValue(
                  convertDateToTimestamp(
                    e.toDate(Intl.DateTimeFormat().resolvedOptions().timeZone)
                  )
                );
              }}
            />
          </div>
        )}
        <Dropdown className="p-0">
          <DropdownTrigger className="p-0">
            <Button isIconOnly variant="light">
              <IoFilter size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Dropdown Variants"
            variant={"flat"}
            items={searchFilters}
          >
            {(item) => {
              return (
                <DropdownItem
                  onClick={() => {
                    setSelectedFilterOption(item);
                    setSearchValue("");
                    setSelectedFilterValue("");
                  }}
                  key={item.key}
                >
                  {item.value}
                </DropdownItem>
              );
            }}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};
