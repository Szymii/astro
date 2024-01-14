import { Button } from "@/system/ui/button";
import { Suspense, useState } from "react";
import { useSuspense } from "./useSuspense";

export const ReactCache = () => {
  const [boxVisible, setBoxVisible] = useState(false);
  const [cuteVisible, setCuteVisible] = useState(false);
  const [sadVisible, setSadVisible] = useState(false);

  return (
    <>
      <div className="container flex min-h-[300px] flex-col items-start gap-6 py-8">
        <Button onClick={() => setBoxVisible((prev) => !prev)}>Show</Button>
        {boxVisible && (
          <Suspense fallback={<>Loading ...</>}>
            <Section tag="box" />
          </Suspense>
        )}
      </div>
      <div className="container flex min-h-[300px] flex-col items-start gap-6 py-8">
        <Button onClick={() => setCuteVisible((prev) => !prev)}>Show</Button>
        {cuteVisible && (
          <Suspense fallback={<>Loading ...</>}>
            <Section tag="fat" />
          </Suspense>
        )}
      </div>
      <div className="container flex min-h-[300px] flex-col items-start gap-6 py-8">
        <Button onClick={() => setSadVisible((prev) => !prev)}>Show</Button>
        {sadVisible && (
          <Suspense fallback={<>Loading ...</>}>
            <Section tag="sad" />
          </Suspense>
        )}
      </div>
    </>
  );
};

export const Section = ({ tag }: { tag: string }) => {
  const { data } = useSuspense<{ _id: string }[]>({
    url: `https://cataas.com/api/cats?tags=${tag}`,
  });

  return (
    <div className="flex gap-4">
      {data.slice(0, 3).map(({ _id }) => (
        <img
          key={_id}
          src={`https://cataas.com/cat/${_id}`}
          className="h-36 w-36 object-cover"
        />
      ))}
    </div>
  );
};
