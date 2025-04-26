export type Organization = {
  id: string;
  name: string;
  description: string | null;
  type: "organization" | "group" | "position";
  status: "active" | "inactive";
  groups?: Group[];
  positions?: Position[];
};

export type Group = {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "inactive";
  type: "group";
  groups?: Group[];
  positions?: Position[];
};

export type Position = {
  id: string;
  name: string;
  type: "position";
  description: string | null;
  status: "active" | "inactive";
  groups?: Group[];
  positions?: Position[];
};
