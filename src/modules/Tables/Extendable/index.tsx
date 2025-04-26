import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/system/ui/table";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type ExpandedState,
} from "@tanstack/react-table";
import { Badge } from "@/system/ui/badge";
import type { Organization } from "./Organization";
import { organizations } from "./organizations";
import { useState } from "react";

const columnHelper = createColumnHelper<Organization>();

const columns = [
  columnHelper.accessor("name", {
    cell: ({ row, getValue }) => {
      const canExpand = row.getCanExpand();
      const depth = canExpand
        ? `${row.depth * 24}px`
        : `${row.depth * 24 + 16}px`;

      return (
        <div
          className="flex gap-2"
          style={{
            paddingLeft: depth,
          }}
        >
          {canExpand && (
            <input
              type="checkbox"
              defaultChecked={row.getIsExpanded()}
              onClick={row.getToggleExpandedHandler()}
            />
          )}
          {getValue()}
        </div>
      );
    },
  }),
  columnHelper.accessor("type", {
    cell: (info) => {
      const status = info.getValue();

      switch (status) {
        case "organization":
          return <Badge className="bg-blue-500">Org</Badge>;
        case "group":
          return <Badge className="bg-amber-600">Group</Badge>;
        case "position":
          return <Badge className="bg-emerald-600">Position</Badge>;
        default:
          return <Badge>Unknown</Badge>;
      }
    },
  }),
  columnHelper.accessor("status", {
    cell: (info) => {
      const status = info.getValue();

      if (status === "active") {
        return <Badge variant="default">Active</Badge>;
      }
      return <Badge variant="destructive">Inactive</Badge>;
    },
  }),
  columnHelper.accessor("description", {
    cell: (info) =>
      info.getValue() || <div className="text-gray-400 italic">Empty</div>,
  }),
];

export const Extendable = () => {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data: organizations,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => {
      if (row.groups && row.positions) {
        return [...row.groups, ...row.positions];
      }

      if (row.groups) {
        return row.groups;
      }

      if (row.positions) {
        return row.positions;
      }

      return undefined;
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-2 pb-36">
      <div className="mt-10 flex w-full max-w-2xl flex-col items-stretch justify-center gap-4 md:flex-row">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-900">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
};
