import { Button } from "@/system/ui/button";
import {
  Dialog as UiDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/system/ui/dialog";
import type { ReactNode } from "react";

import { atom, useAtom } from "jotai";

interface IProps {
  trigger: ReactNode;
}

export const counterState = atom(0);

export const CounterDialog = ({ trigger }: IProps) => {
  const [state, setState] = useAtom(counterState);

  return (
    <UiDialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Counter</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center text-2xl font-bold">{state}</div>
        <DialogFooter className="justify-center">
          <Button onClick={() => setState((prev) => prev + 1)}>
            Increment
          </Button>
          <Button onClick={() => setState((prev) => prev - 1)}>
            Decrement
          </Button>
        </DialogFooter>
      </DialogContent>
    </UiDialog>
  );
};
