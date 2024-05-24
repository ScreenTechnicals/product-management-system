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
import { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { SiMicrosoftexcel } from "react-icons/si";

type ProfileModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
>;

const filterOptions: LabelOptionType[] = [
  {
    label: "purchaseDate",
    value: "Purchase Date",
  },
  {
    label: "issueDate",
    value: "Issue Date",
  },
];

export const DownloadItemsModal = ({
  isOpen,
  onClose,
  onOpenChange,
}: ProfileModalProps) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadExcelParams, setDownloadExcelParams] =
    useState<DownloadExcelProps>({
      fromDate: undefined,
      toDate: undefined,
      filterBy: undefined,
      collectionName: undefined,
    });
  let itemsType = collectionNames.filter((item) => {
    return item.label === downloadExcelParams.collectionName;
  })[0]?.value;

  let filterType = filterOptions.filter((item) => {
    return item.label === downloadExcelParams.filterBy;
  })[0]?.value;

  let isFromDateInvalid =
    downloadExcelParams.toDate !== undefined &&
    downloadExcelParams.fromDate !== undefined &&
    (downloadExcelParams.fromDate ?? 0) > (downloadExcelParams.toDate ?? 1);

  let isToDateInvalid =
    downloadExcelParams.toDate !== undefined &&
    downloadExcelParams.fromDate !== undefined &&
    (downloadExcelParams.fromDate ?? 0) > (downloadExcelParams.toDate ?? 1);

  useEffect(() => {
    if (!isOpen) {
      setDownloadExcelParams({
        fromDate: undefined,
        toDate: undefined,
        filterBy: undefined,
        collectionName: undefined,
      });
    }
  }, [isOpen]);

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
                                    collectionName: item.label,
                                  };
                                });
                                if (item.label === "items-in") {
                                  setDownloadExcelParams((value) => {
                                    return {
                                      ...value,
                                      filterBy: "purchaseDate",
                                    };
                                  });
                                }
                              }}
                              key={item.label}
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
                              hidden={
                                itemsType === "Items In" &&
                                item.label === "issueDate"
                              }
                              onClick={() => {
                                setDownloadExcelParams((value) => {
                                  return {
                                    ...value,
                                    filterBy: item.label,
                                  };
                                });
                              }}
                              key={item.label}
                            >
                              {item.value}
                            </DropdownItem>
                          );
                        }}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <DatePicker
                    isInvalid={isFromDateInvalid}
                    errorMessage={
                      isFromDateInvalid &&
                      "From date should be less than To date"
                    }
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
                    isInvalid={isToDateInvalid}
                    errorMessage={
                      isToDateInvalid &&
                      "To date should be greater than From date"
                    }
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
                  isLoading={downloading}
                  onClick={() => {
                    // if(downloadExcelParams.fromDate)
                    setDownloading(true);
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
                      itemsType = "";
                      setDownloading(false);
                    });
                  }}
                  color="success"
                  startContent={<SiMicrosoftexcel size={20} />}
                >
                  {downloading ? "Downloading" : "Download Excel"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
