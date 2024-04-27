"use client";

import { Header, Loading } from "@/components";
import { auth } from "@/configs";
import { login } from "@/helpers";
import { Button } from "@nextui-org/react";
import { PropsWithChildren } from "react";
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

  if (loading) return <Loading />;
  if (!user) return <LoginComponent />;

  return (
    <NextUI>
      <Toaster position="top-center" />
      <div className="2xl:grid h-[100vh] 2xl:grid-rows-[auto_1fr] selection:bg-primary-500/30s">
        <Header />
        {children}
      </div>
    </NextUI>
  );
};
