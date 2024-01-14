interface Props {
  url: string;
}

const cacheMap = new Map<string, unknown>();

export const useSuspense = <T>({ url }: Props) => {
  const value = cacheMap.get(url) || null;

  if (value) {
    return { data: value as T };
  }

  const promise = fetch(url).then((response) => response.json());

  promise.then((data) => {
    cacheMap.set(url, data);
  });

  throw promise;
};
