export type SearchFilterType = {
  key: "id" | "purchaseDate" | "requisitionBy" | "issueDate" | "stockRef";
  value: string;
  type: "string" | "date";
};
