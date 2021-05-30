import { useHierarchy } from "nampi-use-api";
import { InheritancePath } from "../InheritancePath";

interface Props {
  className?: string;
  iri: string;
}

export const ItemInheritance = ({ className, iri }: Props) => {
  const { data } = useHierarchy({
    query: { iri },
  });
  return (
    <div className="leading-none">
      {data ? (
        data.paths.map((path) => (
          <div className={className} key={JSON.stringify(path)}>
            <InheritancePath path={path} allItems={data.items} />
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};
