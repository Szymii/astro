import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/system/ui/dialog";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  id: string;
}

export const CellDialog = ({ children, id }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog for org {id}</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
