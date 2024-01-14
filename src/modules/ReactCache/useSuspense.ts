import { useEffect, useState } from "react";

interface Props {
  url: string;
}

export const useSuspense = <T>({ url }: Props) => {
  const [data, setData] = useState<T | null>(null);

  const fetchData = async () => {
    try {
      const result = await fetch(url);
      const data = await result.json();
      setData(data);
    } catch (e) {
      //
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data };
};
