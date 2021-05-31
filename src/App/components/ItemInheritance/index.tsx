import { Item, useHierarchy } from "nampi-use-api";
import { InheritancePath } from "../InheritancePath";

interface Props {
  className?: string;
  item: Item;
}

export const ItemInheritance = ({ className, item }: Props) => {
  const { data } = useHierarchy({
    query: { iri: item.id },
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
