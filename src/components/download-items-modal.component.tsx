import { collectionNames } from "@/common/consts";
import { LabelOptionType } from "@/common/types";
import {
  convertDateToTimestamp,
  downloadExcel,
  DownloadExcelProps,
} from "@/helpers";
import { getLocalTimeZone } from "@internationalized/date";
import {
  Button,
  DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { SiMicrosoftexcel } from "react-icons/si";

type ProfileModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
>;

const filterOptions: LabelOptionType[] = [
  {
    key: "purchaseDate",
    value: "Purchase Date",
  },
  {
    key: "issueDate",
    value: "Issue Date",
  },
];

export const DownloadItemsModal = ({
  isOpen,
  onClose,
  onOpenChange,
}: ProfileModalProps) => {
  const [downloadExcelParams, setDownloadExcelParams] =
    useState<DownloadExcelProps>({
      fromDate: undefined,
      toDate: undefined,
      filterBy: undefined,
      collectionName: undefined,
    });
  const itemsType = collectionNames.filter((item) => {
    return item.key === downloadExcelParams.collectionName;
  })[0]?.value;

  const filterType = filterOptions.filter((item) => {
    return item.key === downloadExcelParams.filterBy;
  })[0]?.value;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Download Excel
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-5">
                  <div className="flex gap-5">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="flat"
                          color="primary"
                          endContent={<BiChevronDown size={20} />}
                          className="py-7 w-1/2"
                        >
                          <span>
                            {downloadExcelParams.collectionName ===
                            undefined ? (
                              <>
                                Items Type{" "}
                                <span className="text-red-500">*</span>
                              </>
                            ) : (
                              itemsType
                            )}
                          </span>
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        variant="flat"
                        aria-label="Dynamic Actions"
                        items={collectionNames}
                      >
                        {(item) => {
                          return (
                            <DropdownItem
                              onClick={() => {
                                setDownloadExcelParams((value) => {
                                  return {
                                    ...value,
                                    collectionName: item.key,
                                  };
                                });
                              }}
                              key={item.key}
                            >
                              {item.value}
                            </DropdownItem>
                          );
                        }}
                      </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="flat"
                          color="primary"
                          endContent={<BiChevronDown size={20} />}
                          className="py-7 w-1/2"
                        >
                          <span>
                            {downloadExcelParams.filterBy === undefined ? (
                              <>
                                Filter By{" "}
                                <span className="text-red-500">*</span>
                              </>
                            ) : (
                              filterType
                            )}
                          </span>
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        variant="flat"
                        aria-label="Dynamic Actions"
                        items={filterOptions}
                      >
                        {(item) => {
                          return (
                            <DropdownItem
                              onClick={() => {
                                setDownloadExcelParams((value) => {
                                  return {
                                    ...value,
                                    filterBy: item.key,
                                  };
                                });
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
                  <DatePicker
                    label="From"
                    hideTimeZone
                    fullWidth
                    showMonthAndYearPickers
                    color="primary"
                    onChange={(e) => {
                      setDownloadExcelParams((value) => {
                        return {
                          ...value,
                          fromDate: convertDateToTimestamp(
                            e.toDate(getLocalTimeZone())
                          ),
                        };
                      });
                    }}
                    isRequired
                  />
                  <DatePicker
                    label="To"
                    hideTimeZone
                    fullWidth
                    color="primary"
                    showMonthAndYearPickers
                    onChange={(e) => {
                      setDownloadExcelParams((value) => {
                        return {
                          ...value,
                          toDate: convertDateToTimestamp(
                            e.toDate(getLocalTimeZone())
                          ),
                        };
                      });
                    }}
                    isRequired
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="shadow"
                  fullWidth
                  className="text-white"
                  onClick={() => {
                    downloadExcel(
                      downloadExcelParams.fromDate,
                      downloadExcelParams.toDate,
                      downloadExcelParams.filterBy,
                      downloadExcelParams.collectionName
                    ).finally(() => {
                      setDownloadExcelParams({
                        fromDate: undefined,
                        toDate: undefined,
                        filterBy: undefined,
                        collectionName: undefined,
                      });
                      onClose();
                    });
                  }}
                  color="success"
                  startContent={<SiMicrosoftexcel size={20} />}
                >
                  Download Excel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
