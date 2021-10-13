import { Type } from "App/components/TypeInput";
import { useHierarchy } from "nampi-use-api";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useLocaleLiteral } from "./useLocaleLiteral";

interface WithItem {
  itemId: string;
}
interface WithDefault {
  defaultType: string;
}

const isWithItem = (config: WithItem | WithDefault): config is WithItem =>
  (config as WithItem).itemId !== undefined;

export const useEditorTypes = (
  config: WithItem | WithDefault
): [types: Type[], setTypes: Dispatch<SetStateAction<Type[]>>] => {
  const literal = useLocaleLiteral();
  const iri = isWithItem(config) ? config.itemId : config.defaultType;
  const hierarchy = useHierarchy({ query: { iri } });
  const [types, setTypes] = useState<Type[]>([]);
  const initialized = useRef(false);
  useEffect(() => {
    if (hierarchy.data && !initialized.current) {
      const newTypes = isWithItem(config)
        ? hierarchy.data.paths
            .map((path) => path[1] || path[0])
            .map<Type>((value) => ({
              text: literal(hierarchy.data?.items[value].labels),
              value,
            }))
        : [{ value: iri, text: literal(hierarchy.data?.items[iri].labels) }];
      initialized.current = true;
      setTypes(newTypes);
    }
  }, [config, hierarchy, hierarchy.data, iri, literal, types]);
  return [types, setTypes];
};
