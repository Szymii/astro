import type { Organization } from "./Organization";

const statuses: Organization["status"][] = ["active", "inactive"];
const descriptions = [
  "A leader in its industry.",
  "Currently expanding operations.",
  "Known for innovation.",
  "Recently restructured.",
  null,
];

export const organizations: Organization[] = Array.from(
  { length: 1500 },
  (_, i) => ({
    id: `org-${(i + 1).toString().padStart(4, "0")}`,
    name: `Organization ${i + 1}`,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }),
);
