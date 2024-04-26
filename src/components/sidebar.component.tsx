import { Button } from "@nextui-org/react";
import React from "react";
import { BiChevronRight } from "react-icons/bi";

export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: any) => {
  return (
    <div className="shadow-md top-0 left-0 md:w-[400px] h-[100svh] bg-[#211a4a] md:relative fixed transition-transform duration-200 z-20 w-0 overflow-hidden">
      <div className="p-5">
        <p className="text-center uppercase font-extrabold text-danger-500 text-2xl">
          Dashboard
        </p>
        <div>
          <Button
            variant="flat"
            type="button"
            className="w-full px-5 font-medium uppercase"
            color="warning"
          >
            Items In
          </Button>
        </div>
      </div>
    </div>
  );
};
