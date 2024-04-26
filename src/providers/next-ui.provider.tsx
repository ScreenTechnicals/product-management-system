import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren } from "react";

type NextUIProps = PropsWithChildren<{}>;

export const NextUI = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return <NextUIProvider navigate={router.push}>{children}</NextUIProvider>;
};
