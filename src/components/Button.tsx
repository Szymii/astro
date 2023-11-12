import type { ComponentProps } from "react";
import { cn } from "../utils/cn";

type OverrideProps<T, TOverridden> = Omit<T, keyof TOverridden> & TOverridden;

type Props = OverrideProps<
  ComponentProps<"button">,
  {
    onClick: () => void;
  }
>;

export const Button = ({ className, onClick, children }: Props) => {
  return (
    <button
      className={cn(
        "min-w-[200px] rounded-md bg-black px-4 py-2 text-white",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
