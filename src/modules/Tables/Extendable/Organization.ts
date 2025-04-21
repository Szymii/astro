export type Organization = {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "inactive";
  groups: Group[];
};

export type Group = {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "inactive";
  groups: Group[];
  positions: Position[];
};

export type Position = {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "inactive";
};
