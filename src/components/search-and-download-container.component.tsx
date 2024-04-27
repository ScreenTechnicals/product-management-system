import { SearchFilterType } from "@/common/types";
import { downloadExcel } from "@/helpers";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { IoFilter } from "react-icons/io5";

type SearchAndDownloadContainerProps = {
  itemsDataSanpshots: any;
  selectedFilterOption: any;
  searchFilters: SearchFilterType[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  setSelectedFilterOption: (value: any) => void;
  setSelectedFilterValue: (value: string) => void;
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
        <Input
          type={selectedFilterOption.type}
          placeholder={`Search By ${selectedFilterOption.value}`}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          value={searchValue}
          endContent={
            <Dropdown className="p-0">
              <DropdownTrigger className="p-0">
                <button className="h-full p-3 relative left-3">
                  <IoFilter />
                </button>
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
                      }}
                      key={item.key}
                    >
                      {item.value}
                    </DropdownItem>
                  );
                }}
              </DropdownMenu>
            </Dropdown>
          }
        />
        <Button
          onPress={() => {
            // FIX Date Filter Query
            setSelectedFilterValue(searchValue);
          }}
          color="secondary"
          variant="flat"
        >
          Search
        </Button>
      </div>
    </div>
  );
};
