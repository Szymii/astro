import type { Organization, Group, Position } from "./Organization";

const statuses: Array<"active" | "inactive"> = ["active", "inactive"];
const descriptions = [
  "Handles internal operations.",
  "Focused on strategic growth.",
  "Remote-first team.",
  null,
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createPosition(id: number): Position {
  return {
    id: `pos-${id}`,
    name: `Position ${id}`,
    description: getRandom(descriptions),
    status: getRandom(statuses),
  };
}

function createGroup(id: number, depth = 0): Group {
  const subGroupCount = depth < 1 ? Math.floor(Math.random() * 3) : 0;
  const positionCount = Math.floor(Math.random() * 4);

  return {
    id: `grp-${id}`,
    name: `Group ${id}`,
    description: getRandom(descriptions),
    status: getRandom(statuses),
    groups: Array.from({ length: subGroupCount }, (_, i) =>
      createGroup(id * 10 + i + 1, depth + 1),
    ),
    positions: Array.from({ length: positionCount }, (_, i) =>
      createPosition(id * 10 + i + 1),
    ),
  };
}

export const organizations: Organization[] = Array.from(
  { length: 10 },
  (_, i) => ({
    id: `org-${i + 1}`,
    name: `Organization ${i + 1}`,
    description: getRandom(descriptions),
    status: getRandom(statuses),
    groups: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (__, j) =>
      createGroup(i * 100 + j + 1),
    ),
  }),
);
