import { logout } from "@/helpers";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { User } from "firebase/auth";
import { IoLogOutOutline } from "react-icons/io5";
// import Image from "next/image";

type ProfileModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "onOpenChange"
> & {
  user: User;
};

export const ProfileModal = ({
  isOpen,
  onClose,
  onOpenChange,
  user,
}: ProfileModalProps) => {
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
                Profile Details
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-5">
                  <Avatar
                    color="primary"
                    isBordered
                    src={user?.photoURL!}
                    alt={user?.displayName?.slice(0, 1)}
                    size="lg"
                  />

                  <div>
                    <p className="text-base font-bold p-0 m-0">
                      {user?.displayName}
                    </p>
                    <p className="text-base font-bold p-0 m-0">{user?.email}</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={logout}
                  color="danger"
                  onPress={onClose}
                  className="w-full"
                  startContent={<IoLogOutOutline size={20} />}
                >
                  Logout
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
