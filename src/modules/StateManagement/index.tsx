import { Button } from "@/system/ui/button";
import { CounterDialog, counterState } from "./CounterDialog";
import { atom, getDefaultStore, useAtom } from "jotai";
import { userAtom } from "@/userAtom";
import { createContext, memo, useContext, useMemo, useState } from "react";
import { generateUID } from "@/utils";

const SomeContext = createContext<number>(0);
const refreshState = atom(false);

export const StateManagement = () => {
  const [state] = useAtom(counterState);
  const [refresh, setState] = useAtom(refreshState);
  const cashedState = useMemo(() => state, [refresh]);
  const defaultStore = getDefaultStore();

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center gap-12">
      <CounterDialog trigger={<Button>Counter {state}</Button>} />
      <Button onClick={() => setState(!refresh)}>Refresh cashed state</Button>

      <div>
        This name <strong>{defaultStore.get(userAtom)?.name}</strong> is set
        outside react
      </div>

      <SomeContext.Provider value={state}>
        <Child cashedState={cashedState} />
      </SomeContext.Provider>
    </div>
  );
};

const Child = memo(({ cashedState }: { cashedState: number }) => {
  const [state, setState] = useState(0);

  return (
    <>
      <div
        key={generateUID()}
        className="animate-rerender border-2 border-solid border-sky-200 p-10 px-20 pb-40"
      >
        <Button onClick={() => setState((prev) => ++prev)}>
          Child {state}
        </Button>
        <div className="mt-5">Cashed state {cashedState}</div>
      </div>
      {/* outside div with `generateUID` to not trigger rerenders */}
      <GrandChild />
    </>
  );
});

const GrandChild = memo(() => {
  const state = useContext(SomeContext);

  return (
    <div
      key={generateUID()}
      className="mt-[-180px] animate-rerender border-2 border-solid border-sky-200 p-10"
    >
      GrandChild {state}
    </div>
  );
});
