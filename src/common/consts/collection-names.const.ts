import { LabelOptionType } from "../types";

export const collectionNames: LabelOptionType[] = [
  {
    label: "items-in",
    value: "Items In",
  },
  {
    label: "items-out",
    value: "Items Out",
  },
  {
    label: "items-stock",
    value: "Items Stock",
  },
] as const;
