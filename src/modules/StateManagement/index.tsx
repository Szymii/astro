import { Button } from "@/system/ui/button";
import { CounterDialog, counterState } from "./CounterDialog";
import { getDefaultStore, useAtom } from "jotai";
import { userAtom } from "@/userAtom";

export const StateManagement = () => {
  const [state] = useAtom(counterState);
  const defaultStore = getDefaultStore();

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center gap-12">
      <CounterDialog trigger={<Button>Counter {state}</Button>} />

      <div>
        This name <strong>{defaultStore.get(userAtom)?.name}</strong> is set
        outside react
      </div>
    </div>
  );
};
