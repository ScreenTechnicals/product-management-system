import { Card, CardBody } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="w-full md:px-10 p-5">
      <div className="flex place-items-center place-content-center w-full md:h-[60svh]">
        <Card className="w-full mx-auto md:w-[500px]">
          <CardBody className="overflow-visible py-2">
            <h1 className="text-center font-bold md:text-xl text-base">
              KIPL Store Management System
            </h1>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
