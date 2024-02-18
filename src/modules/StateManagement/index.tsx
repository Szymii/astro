import { Button } from "@/system/ui/button";
import { CounterDialog, counterState } from "./CounterDialog";
import { getDefaultStore, useAtom } from "jotai";
import { userAtom } from "@/userAtom";
import { createContext, memo, useContext, useState } from "react";

const SomeContext = createContext<number>(0);

export const StateManagement = () => {
  const [state] = useAtom(counterState);
  const defaultStore = getDefaultStore();
  console.log("parent");

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center gap-12">
      <CounterDialog trigger={<Button>Counter {state}</Button>} />

      <div>
        This name <strong>{defaultStore.get(userAtom)?.name}</strong> is set
        outside react
      </div>

      <SomeContext.Provider value={state}>
        <Child />
      </SomeContext.Provider>
    </div>
  );
};

const Child = memo(() => {
  const [state, setState] = useState(0);
  console.log("child");
  return (
    <div>
      <Button onClick={() => setState((prev) => ++prev)}>Child {state}</Button>
      <GrandChild />
    </div>
  );
});

const GrandChild = memo(() => {
  const state = useContext(SomeContext);
  console.log("grand");
  return <div className="mt-5">GrandChild {state}</div>;
});
