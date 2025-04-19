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
  useReactTable,
} from "@tanstack/react-table";
import type { Organization } from "./Organization";
import { Badge } from "@/system/ui/badge";
import { organizations } from "./organizations";
import { Button } from "@/system/ui/button";
import { CellDialog } from "./CellDialog";
import { useMemo, useState } from "react";

const columnHelper = createColumnHelper<Organization>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
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
  columnHelper.accessor("id", {
    cell: (info) => {
      const id = info.getValue();
      return (
        <CellDialog id={id}>
          <Button variant="link">{"Click me"}</Button>
        </CellDialog>
      );
    },
  }),
];

export const Virtual = () => {
  const [search, setSearch] = useState("");
  const orgs = useMemo(() => {
    return organizations;
  }, []);

  const filtered = useMemo(() => {
    if (search === "") return orgs;
    return orgs.filter((org) =>
      org.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [orgs, search]);

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-2 pb-36">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="search"
      />
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
