import { useEffect, useState } from "react";
import { Button } from "./Button";
import { cn } from "@/utils/cn";

interface IProps {
  gameData: Record<string, string>;
}

interface GameObject {
  value: string;
  state: "DEFAULT" | "SELECTED" | "ERROR";
}

export const ReactGame = ({ gameData }: IProps) => {
  const row = [...Object.keys(gameData), ...Object.values(gameData)];

  const [options, setOptions] = useState<GameObject[]>(
    row
      .sort(() => Math.random() - 0.5)
      .map((option) => ({
        value: option,
        state: "DEFAULT",
      })),
  );

  const selectedOptions = options.filter(({ state }) => state === "SELECTED");
  const withErrors = options.filter(({ state }) => state === "ERROR");

  useEffect(() => {
    if (selectedOptions.length === 1) {
      return setOptions((prev) =>
        prev.map((option) =>
          withErrors.includes(option)
            ? {
                ...option,
                state: "DEFAULT",
              }
            : option,
        ),
      );
    }

    if (selectedOptions.length < 2) return;

    if (
      gameData[selectedOptions[0].value] === selectedOptions[1].value ||
      gameData[selectedOptions[1].value] === selectedOptions[0].value
    ) {
      return setOptions((prev) =>
        prev.filter((option) => !selectedOptions.includes(option)),
      );
    }

    if (withErrors.length === 0) {
      return setOptions((prev) =>
        prev.map((option) =>
          selectedOptions.includes(option)
            ? {
                ...option,
                state: "ERROR",
              }
            : option,
        ),
      );
    }
  }, [selectedOptions.length]);

  if (options.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center gap-6 py-10">
        <h1 className="text-8xl font-black text-white">GG</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center gap-6 py-10">
      {options.map(({ value, state }) => (
        <Button
          key={value}
          className={cn({
            "bg-blue-600": state === "SELECTED",
            "bg-red-600": state === "ERROR",
          })}
          onClick={() => {
            setOptions((prev) =>
              prev.map((option) =>
                option.value === value
                  ? {
                      ...option,
                      state: "SELECTED",
                    }
                  : option,
              ),
            );
          }}
        >
          {value}
        </Button>
      ))}
    </div>
  );
};
