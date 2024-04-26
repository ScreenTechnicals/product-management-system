import Image from "next/image";
import React from "react";

export const Loading = () => {
  return (
    <div className="w-full h-[100svh] flex place-content-center place-items-center">
      <Image src={"/images/Loading.gif"} alt="" width={200} height={200} />
    </div>
  );
};
