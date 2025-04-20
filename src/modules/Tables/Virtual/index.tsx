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
  type Row,
  type Table as TTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Virtualizer, VirtualItem } from "@tanstack/react-virtual";
import type { Organization } from "./Organization";
import { Badge } from "@/system/ui/badge";
import { organizations } from "./organizations";
import { Button } from "@/system/ui/button";
import { CellDialog } from "./CellDialog";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

const columnHelper = createColumnHelper<Organization>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    cell: (info) => {
      const status = info.getValue();
      return (
        <div>
          {status === "active" ? (
            <Badge variant="default">Active</Badge>
          ) : (
            <Badge variant="destructive">Inactive</Badge>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor("description", {
    cell: (info) =>
      info.getValue() ? (
        <span className="text-wrap">{info.getValue()}</span>
      ) : (
        <div className="text-gray-400 italic">Empty</div>
      ),
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

  const tableContainerRef = useRef<HTMLDivElement>(null);

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
    <main className="flex min-h-screen flex-col items-center justify-center py-2">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="search"
      />
      <div className="mt-10 flex w-full max-w-2xl flex-col items-stretch justify-center gap-4 md:flex-row">
        <div
          className="relative container h-[600px] overflow-auto px-0"
          ref={tableContainerRef}
        >
          <table className="grid">
            <TableHeader className="sticky top-0 z-1 grid">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="flex w-full bg-gray-900"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="flex items-center text-center"
                      style={{
                        width: header.getSize(),
                      }}
                    >
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
            <Body
              table={table}
              tableContainerRef={tableContainerRef as RefObject<HTMLDivElement>}
            />
          </table>
        </div>
      </div>
    </main>
  );
};

interface TableBodyProps {
  table: TTable<Organization>;
  tableContainerRef: RefObject<HTMLDivElement>;
}

function Body({ table, tableContainerRef }: TableBodyProps) {
  const { rows } = table.getRowModel();
  const [isRefReady, setIsRefReady] = useState(false);

  // Check if the ref is ready after mounting
  useEffect(() => {
    if (tableContainerRef.current) {
      setIsRefReady(true);
    }
  }, [tableContainerRef]);

  // Important: Keep the row virtualizer in the lowest component possible to avoid unnecessary re-renders.
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 54, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  // Render nothing or a fallback until the ref is ready
  if (!isRefReady || !tableContainerRef.current) {
    return null;
  }

  return (
    <TableBody
      className="relative grid"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<Organization>;

        return (
          <VRow
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            rowVirtualizer={rowVirtualizer}
          />
        );
      })}
    </TableBody>
  );
}

interface TableBodyRowProps {
  row: Row<Organization>;
  virtualRow: VirtualItem;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
}

const VRow = ({ row, virtualRow, rowVirtualizer }: TableBodyRowProps) => {
  return (
    <tr
      data-index={virtualRow.index} //needed for dynamic row height measurement
      ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
      key={row.id}
      className="data-[state=selected]:bg-muted hover:bg-muted/50 absolute flex h-[54px] w-full border-b transition-colors"
      style={{
        transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className="flex items-center"
          style={{
            width: cell.column.getSize(),
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </tr>
  );
};
