"use client";

import { auth } from "@/configs";
import { logout } from "@/helpers";
import {
  Avatar,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  useDisclosure,
} from "@nextui-org/react";

import { routes } from "@/common/consts";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline, IoMenuOutline } from "react-icons/io5";
import { AddItemModal } from "./add-item-modal.componet";
import { ProfileModal } from "./profile-modal.component";

const navLinks = [
  { title: routes.dashboard.title, href: routes.dashboard.pathname },
  { title: routes.itemsIn.title, href: routes.itemsIn.pathname },
  { title: routes.itemsOut.title, href: routes.itemsOut.pathname },
  { title: routes.itemsStock.title, href: routes.itemsStock.pathname },
];

export const Header = () => {
  const [user] = useAuthState(auth);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const pathname = usePathname();

  const currentPathTitle = navLinks.find(
    (link) => link.href === pathname
  )?.title;

  const {
    isOpen: isOpenProfile,
    onOpen: onOpenProfile,
    onClose: onCloseProfile,
    onOpenChange: onOpenChangeProfile,
  } = useDisclosure();

  return (
    <header className="w-full sticky flex justify-between items-center z-[10] bg-[#eeeeee] py-5 md:px-10 px-5 top-0 left-0">
      <ButtonGroup variant="flat" className="flex items-center gap-1 md:gap-5">
        <Dropdown placement="bottom-end">
          <DropdownTrigger className="rounded-full cursor-pointer outline-none">
            <button className="cursor-pointer">
              <IoMenuOutline size={30} />
            </button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            selectionMode="single"
            className="max-w-[300px]"
          >
            {navLinks.map((link) => {
              return (
                <DropdownItem as={Link} href={link.href} key={link.title}>
                  {link.title}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
        <span className="text-xl md:text-2xl font-bold text-primary-500">
          {currentPathTitle}
        </span>
      </ButtonGroup>
      <div className="flex gap-2 md:gap-5">
        <Button type="button" color="primary" onClick={onOpen}>
          Add Item
        </Button>
        <ButtonGroup variant="flat">
          <Dropdown placement="bottom-end">
            <DropdownTrigger className="rounded-full cursor-pointer">
              <Avatar
                color="primary"
                isBordered
                src={user?.photoURL!}
                alt={user?.displayName?.slice(0, 1)}
              />
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              selectionMode="single"
              className="max-w-[300px]"
            >
              <DropdownItem
                onClick={onOpenProfile}
                key="profile"
                startContent={<CgProfile size={20} />}
              >
                Your Profile
              </DropdownItem>

              <DropdownItem
                onClick={logout}
                key="logout"
                startContent={<IoLogOutOutline size={20} />}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </ButtonGroup>
      </div>
      <AddItemModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
      <ProfileModal
        isOpen={isOpenProfile}
        onClose={onCloseProfile}
        onOpenChange={onOpenChangeProfile}
        user={user!}
      />
    </header>
  );
};
