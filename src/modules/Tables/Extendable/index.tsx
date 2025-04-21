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
import { Badge } from "@/system/ui/badge";
import type { Organization } from "./Organization";
import { organizations } from "./organizations";

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
];

export const Extendable = () => {
  const table = useReactTable({
    data: organizations,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
