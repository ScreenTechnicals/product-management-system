import { SearchFilterType } from "@/common/types";
import { convertDateToTimestamp, downloadExcel } from "@/helpers";
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
import { IoFilter, IoSearch } from "react-icons/io5";

type SearchAndDownloadContainerProps = {
  itemsDataSanpshots: any;
  selectedFilterOption: any;
  searchFilters: SearchFilterType[];
  searchValue: string;
  setSearchValue: (value: any) => void;
  setSelectedFilterOption: (value: any) => void;
  setSelectedFilterValue: (value: string | Timestamp) => void;
};

export const SearchAndDownloadContainer = ({
  itemsDataSanpshots: itemsInDataSanpshots,
  selectedFilterOption,
  searchFilters,
  searchValue,
  setSearchValue,
  setSelectedFilterOption,
  setSelectedFilterValue,
}: SearchAndDownloadContainerProps) => {
  return (
    <div className="flex items-center justify-between gap-2 md:gap-5 bg-white p-3 rounded-xl shadow-sm">
      <Button
        variant="flat"
        onClick={() => {
          downloadExcel(itemsInDataSanpshots, "items-in", "items-in");
        }}
        color="success"
      >
        Download
      </Button>
      <div className="flex items-center gap-2 md:gap-5 md:w-1/2">
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
