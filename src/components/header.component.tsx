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

import { useAuthState } from "react-firebase-hooks/auth";
import { IoMenuOutline } from "react-icons/io5";
import { AddItemModal } from "./add-item-modal.componet";

const navLinks = [
  { title: "Items In", href: "/items/in" },
  { title: "Items Out", href: "/items/out" },
  { title: "Items Stock", href: "/items/stock" },
];

export const Header = () => {
  const [user] = useAuthState(auth);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <header className="w-full sticky flex justify-between items-center z-[10] bg-[#eeeeee] py-5 md:px-10 px-5 top-0 left-0">
      <ButtonGroup variant="flat">
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
      </ButtonGroup>
      <div className="flex gap-5">
        <Button type="button" color="danger" onClick={onOpen}>
          Add Item
        </Button>
        <ButtonGroup variant="flat">
          <Dropdown placement="bottom-end">
            <DropdownTrigger className="rounded-full cursor-pointer">
              <Avatar isBordered src={user?.photoURL || ""} />
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              selectionMode="single"
              className="max-w-[300px]"
            >
              <DropdownItem key="profile">
                <Link href={"/"}>Your Profile</Link>
              </DropdownItem>
              <DropdownItem onClick={logout} key="logout">
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
    </header>
  );
};
