import {
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
  type Row,
  type Table as TTable,
} from "@tanstack/react-table";
import { Badge } from "@/system/ui/badge";
import type { Organization } from "./Organization";
import { organizations } from "./organizations";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Virtualizer, VirtualItem } from "@tanstack/react-virtual";

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

export const AllInOne = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [data, setData] = useState(organizations);

  const table = useReactTable({
    data: data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => {
      if (row.groups && row.positions) return [...row.groups, ...row.positions];
      if (row.groups) return row.groups;
      if (row.positions) return row.positions;
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-2 pb-36">
      <div className="mt-10 flex w-full max-w-2xl flex-col items-stretch justify-center gap-4 md:flex-row">
        <div
          className="relative container h-[600px] overflow-x-hidden overflow-y-auto px-0"
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
      key={row.id}
      ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
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
