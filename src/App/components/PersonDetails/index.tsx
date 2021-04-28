import { rdfs } from "@hydra-cg/heracles.ts";
import { HYDRA_CLIENT } from "App/constants";
import { ItemType } from "App/enums/ItemType";
import { event } from "App/mappers/event";
import { label } from "App/mappers/label";
import { core } from "App/namespaces";
import { Person } from "App/types";
import { extractItem } from "App/utils/extractItem";
import { itemPath } from "App/utils/itemPath";
import { useEffect, useState } from "react";
import { Heading } from "../Heading";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

export const PersonDetails = ({ localId }: { localId: string }) => {
  const [person, setPerson] = useState<undefined | Person>();
  useEffect(() => {
    HYDRA_CLIENT.getResource(
      itemPath(ItemType.Person, { localId, api: true })
    ).then(async (data) => {
      const item = (await extractItem(data)) as any;
      const birth = event(item[core.isBornIn] || []);
      const death = event(item[core.diesIn] || []);
      setPerson({
        id: item["@id"],
        localId,
        label: label(item[rdfs.label]),
        types: item["@type"],
        itemType: ItemType.Person,
        birth,
        death,
      });
    });
  }, [localId]);
  return person ? (
    <>
      <Heading>{person?.label.map((l) => l.value).join(", ")}</Heading>
      {person.birth.length > 0 ? (
        <span>
          Birth{" "}
          {person.birth.map(({ date: d }) => {
            const dString = d.exact
              ? d.exact.getFullYear()
              : d.earliest && d.latest
              ? `${d.earliest.getFullYear()} - ${d.latest.getFullYear()}`
              : d.earliest
              ? d.earliest.getFullYear()
              : d.latest
              ? d.latest.getFullYear()
              : "";
            return dString ? ` (${dString})` : "";
          })}
        </span>
      ) : (
        <></>
      )}
      <br />
      {person.death.length > 0 ? (
        <span>
          Death{" "}
          {person.death.map(({ date: d }) => {
            const dString = d.exact
              ? d.exact.getFullYear()
              : d.earliest && d.latest
              ? `${d.earliest.getFullYear()} - ${d.latest.getFullYear()}`
              : d.earliest
              ? d.earliest.getFullYear()
              : d.latest
              ? d.latest.getFullYear()
              : "";
            return dString ? ` (${dString})` : "";
          })}
        </span>
      ) : (
        <></>
      )}
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
