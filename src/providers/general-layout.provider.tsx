"use client";

import { Header, Loading } from "@/components";
import { auth } from "@/configs";
import { login } from "@/helpers";
import { Button } from "@nextui-org/react";
import { PropsWithChildren, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { NextUI } from "./next-ui.provider";

type GeneralLayoutProps = PropsWithChildren<{}>;

const LoginComponent = () => {
  return (
    <div className="w-full flex place-content-center place-items-center h-[100svh]">
      <Button onClick={login} color="default" variant="shadow">
        <FcGoogle />
        <span>Login With Google</span>
      </Button>
    </div>
  );
};

export const GeneralLayout = ({ children }: GeneralLayoutProps) => {
  const [user, loading] = useAuthState(auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) return <Loading />;
  if (!user) return <LoginComponent />;

  return (
    <NextUI>
      <Toaster position="bottom-left" />
      <div className="grid h-screen grid-rows-[auto_1fr] selection:bg-danger-500/30">
        <Header />
        {children}
      </div>
    </NextUI>
  );
};
