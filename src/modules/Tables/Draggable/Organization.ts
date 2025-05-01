export type Organization = {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "inactive";
};
