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
} from "@tanstack/react-table";
import { Badge } from "@/system/ui/badge";
import { organizations } from "./organizations";
import type { Organization } from "./Organization";
import { DragHandleDots2Icon as DragIcon } from "@radix-ui/react-icons";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useMemo, useState, type CSSProperties } from "react";

const columnHelper = createColumnHelper<Organization>();

const columns = [
  columnHelper.accessor("id", {
    id: "drag-handle",
    header: "",
    cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
    size: 60,
  }),
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

export const Draggable = () => {
  const [data, setData] = useState(organizations);

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data.map(({ id }) => id),
    [data],
  );
  const table = useReactTable({
    data: data,
    columns,
    getRowId: (row) => row.id, //required because row indexes will change
    getCoreRowModel: getCoreRowModel(),
  });

  // reorder rows after drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-2 pb-36">
      <div className="mt-10 flex w-full max-w-2xl flex-col items-stretch justify-center gap-4 md:flex-row">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
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
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <DraggableRow row={row} key={row.id} />
                ))}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </main>
  );
};

const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });

  return (
    // Alternatively, you could set these attributes on the rows themselves
    <button {...attributes} {...listeners}>
      <DragIcon />
    </button>
  );
};

// Row Component
const DraggableRow = ({ row }: { row: Row<Organization> }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    // connect row ref to dnd-kit, apply important styles
    <tr
      data-slot="table-row"
      ref={setNodeRef}
      style={style}
      className="data-[state=selected]:bg-muted hover:bg-muted/50 relative border-b"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </tr>
  );
};
