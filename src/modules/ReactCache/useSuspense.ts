import { useEffect, useState } from "react";

interface Props {
  url: string;
}

const cacheMap = new Map<string, unknown>();

export const useSuspense = <T>({ url }: Props) => {
  const [data, setData] = useState<T | null>((cacheMap.get(url) as T) || null);

  const fetchData = async (url: string) => {
    try {
      const result = await fetch(url);
      if (result.ok) {
        const data = await result.json();
        cacheMap.set(url, data);
        setData(data);
      }
    } catch (e) {
      //
    }
  };

  useEffect(() => {
    if (!cacheMap.has(url)) {
      fetchData(url);
    }
  }, []);

  return { data: data };
};
