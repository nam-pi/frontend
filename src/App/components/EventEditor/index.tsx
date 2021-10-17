import { useEditorTypes } from "App/hooks/useEditorTypes";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { serializeLiteral } from "App/utils/serializeLiteral";
import { format } from "date-fns";
import { JsonLdArray } from "jsonld/jsonld-spec";
import {
    Author,
    Event,
    Hierarchy,
    LiteralString,
    useEvent,
    useEventCreate,
    useEventUpdate,
    useHierarchy,
    useUser
} from "nampi-use-api";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { CommentsField } from "../CommentsField";
import { Couple, CoupleInput } from "../CoupleInput";
import { CoupleRepeater } from "../CoupleRepeater";
import { DateInput, Dates } from "../DateInput";
import { EditorControls } from "../EditorControls";
import { EditorForm } from "../EditorForm";
import { Field } from "../Field";
import { FormError } from "../FormError";
import { FormIntroduction } from "../FormIntroduction";
import { Heading } from "../Heading";
import { Individual, IndividualInput, useIndividual } from "../IndividualInput";
import { IndividualRepeater } from "../IndividualRepeater";
import { Input } from "../Input";
import { LabelsField } from "../LabelsField";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { TextsField } from "../TextsField";
import { Type } from "../TypeInput";
import { TypesField } from "../TypesField";

interface Props {
  idLocal?: string;
}

interface FormState {
  aspects: undefined | Couple[];
  authors: undefined | Individual[];
  comments: undefined | LiteralString[];
  dates: undefined | Dates;
  labels: undefined | LiteralString[];
  mainParticipant: undefined | Couple;
  participants: undefined | Couple[];
  place: undefined | Individual;
  source: undefined | Individual;
  sourceLocation: undefined | string;
  start: undefined | string;
  texts: undefined | LiteralString[];
}

const { core } = namespaces;

const validate = (form: FormState, types: Type[]) =>
  form.authors !== undefined &&
  form.authors.length > 0 &&
  types.length > 0 &&
  form.labels !== undefined &&
  form.labels.length > 0 &&
  form.mainParticipant?.type.value !== undefined &&
  form.mainParticipant?.individual.id !== undefined &&
  form.source?.id !== undefined &&
  form.sourceLocation !== undefined &&
  form.sourceLocation.replace(/\s/g, "").length > 0;

const serializeDates = (dates: undefined | Dates): string =>
  !dates
    ? ""
    : dates.exact
    ? dates.exact
    : dates.start && dates.end
    ? `${dates.start}|${dates.end}`
    : dates.start
    ? `${dates.start}|`
    : dates.end
    ? `|${dates.end}`
    : "";

const findInHierarchy = (id: string, hierarchy: Hierarchy, fallback: string) =>
  id === fallback || hierarchy.items[id] !== undefined;

const indexInHierarchy = (id: string, hierarchy: Hierarchy) => {
  const path = hierarchy.paths.find((path) => path.includes(id));
  return path?.indexOf(id) || -1;
};

const maxIdx = (a: number[]) =>
  a.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);

const useCouples = (event?: Event) => {
  const literal = useLocaleLiteral();
  const [couples, setCouples] = useState<
    undefined | [main: Couple, participants: Couple[], aspects: Couple[]]
  >();
  // participant hierarchy
  const pHierarchy = useHierarchy({
    query: { iri: core.hasParticipant, descendants: true },
    paused: !event,
  })?.data;
  // mainParticipant hierarchy
  const mHierarchy = useHierarchy({
    query: { iri: core.hasMainParticipant, descendants: true },
    paused: !event,
  })?.data;
  // aspects hierarchy
  const aHierarchy = useHierarchy({
    query: { iri: core.usesAspect, descendants: true },
    paused: !event,
  })?.data;
  useEffect(() => {
    if (pHierarchy && mHierarchy && aHierarchy) {
      const main: { [id: string]: string[] } = {};
      const part: { [id: string]: string[] } = {};
      const asp: { [id: string]: string[] } = {};
      for (const [propId, value] of Object.entries(event || {})) {
        if (findInHierarchy(propId, mHierarchy, "mainParticipant")) {
          (Array.isArray(value) ? value : [value]).forEach((v: any) => {
            main[v.id] = [...(main[v.id] || []), propId];
          });
        } else if (findInHierarchy(propId, pHierarchy, "participants")) {
          value?.forEach((v: any) => {
            part[v.id] = [...(part[v.id] || []), propId];
          });
        } else if (findInHierarchy(propId, aHierarchy, "aspect")) {
          value?.forEach((v: any) => {
            asp[v.id] = [...(asp[v.id] || []), propId];
          });
        }
      }
      const mainCouple: Couple = {
        individual: { label: "", id: "" },
        type: { text: "", value: "" },
      };
      for (const [id, types] of Object.entries(main)) {
        const idxs = types.map((type) => indexInHierarchy(type, mHierarchy));
        let value = types[maxIdx(idxs)] || core.hasMainParticipant;
        if (value === "mainParticipant") {
          value = core.hasMainParticipant;
        }
        const label = literal(
          event?.[value]?.[id]?.labels || event?.mainParticipant.labels
        );
        const text = literal(mHierarchy.items[value]?.labels);
        mainCouple.individual = { label, id };
        mainCouple.type = { text, value };
      }
      const partCouples: Couple[] = [];
      for (const [id, types] of Object.entries(part)) {
        const idxs = types.map((type) => indexInHierarchy(type, pHierarchy));
        let value = types[maxIdx(idxs)] || core.hasParticipant;
        if (value === "participants") {
          value = core.hasParticipant;
        }
        const label = literal(
          event?.[value]?.find((a: any) => a.id === id)?.labels ||
            event?.participants.find((a: any) => a.id === id)?.labels
        );
        const text = literal(pHierarchy.items[value].labels);
        partCouples.push({ individual: { id, label }, type: { text, value } });
      }
      const aspCouples: Couple[] = [];
      for (const [id, types] of Object.entries(asp)) {
        const idxs = types.map((type) => indexInHierarchy(type, aHierarchy));
        let value = types[maxIdx(idxs)] || core.usesAspect;
        if (value === "aspects") {
          value = core.usesAspect;
        }
        const label = literal(
          event?.[value]?.find((a: any) => a.id === id)?.labels ||
            event?.aspects.find((a: any) => a.id === id)?.labels
        );
        const text = literal(aHierarchy.items[value].labels);
        aspCouples.push({ individual: { id, label }, type: { text, value } });
      }
      setCouples([mainCouple, partCouples, aspCouples]);
    }
  }, [event, mHierarchy, pHierarchy, aHierarchy, literal]);
  return couples;
};

const useForm = (
  baseUrl: string,
  defaultType: string,
  event: undefined | Event,
  author: Author
) => {
  const history = useHistory();
  const individual = useIndividual();
  const [form, setForm] = useState<FormState>({
    aspects: undefined,
    authors: (event?.act.authors || [author]).map((a) => individual(a)!),
    comments: event?.comments,
    dates: {
      exact: event?.exact ? format(event.exact, "yyyy-MM-dd") : undefined,
      start: event?.earliest ? format(event.earliest, "yyyy-MM-dd") : undefined,
      end: event?.latest ? format(event.latest, "yyyy-MM-dd") : undefined,
    },
    labels: event?.labels,
    mainParticipant: undefined,
    participants: undefined,
    place: individual(event?.place),
    start: event?.earliest ? format(event.earliest, "yyyy-MM-dd") : "",
    source: individual(event?.act.sourceLocation.source),
    sourceLocation: event?.act.sourceLocation.text,
    texts: event?.texts,
  });
  const [types, setTypes] = useEditorTypes(
    event ? { itemId: event.id } : { defaultType }
  );
  const update = useEventUpdate(event?.idLocal || "");
  const create = useEventCreate();
  let mutate = create[0];
  let state = create[1];
  if (event) {
    mutate = update[0];
    state = update[1];
  }
  const couples = useCouples(event);
  useEffect(() => {
    if (couples) {
      setForm((old) => ({
        ...old,
        aspects: couples[2],
        mainParticipant: couples[0],
        participants: couples[1],
      }));
    }
  }, [couples]);
  useEffect(() => {
    if (!state.loading && state.data) {
      window.location.assign(baseUrl + state.data.idLocal);
    }
  }, [baseUrl, history, state, state.data, state.loading]);
  return { form, setForm, types, setTypes, mutate, state };
};

const Editor = ({ event, author }: { event?: Event; author: Author }) => {
  const defaultType = core.event;
  const baseUrl = "/events/";
  const intl = useIntl();
  const { form, setForm, types, setTypes, mutate, state } = useForm(
    baseUrl,
    defaultType,
    event,
    author
  );
  return (
    <EditorForm>
      <FormError error={state.error} />
      <TypesField onChange={setTypes} parent={defaultType} values={types} />
      <LabelsField
        onChange={(labels) => setForm((old) => ({ ...old, labels }))}
        required
        values={form.labels}
      />
      <Field
        help={intl.formatMessage({
          description: "Main participant help text",
          defaultMessage:
            "Enter both the main participant and the type of the participation.",
        })}
        label={intl.formatMessage({
          description: "Main participant label",
          defaultMessage: "Main participant",
        })}
        required
      >
        <CoupleInput
          onChange={(mainParticipant) =>
            setForm((old) => ({ ...old, mainParticipant }))
          }
          individualType="persons"
          label={intl.formatMessage({
            description: "Main participant input label",
            defaultMessage: "Person",
          })}
          placeholder={intl.formatMessage({
            description: "Main particpant input placeholder",
            defaultMessage: "Enter and select a person",
          })}
          propertyType={core.hasMainParticipant}
          value={form.mainParticipant}
        />
      </Field>
      <Field
        help={intl.formatMessage({
          description: "Source citation help text",
          defaultMessage:
            "Add the source of the information on this event. Enter and select a *source* and add the appropriate *source location* text. Depending on the type of source this can be a *page number* or for instance a *full URL* to an online representation of the data like an entry in an online database.",
        })}
        label={intl.formatMessage({
          description: "Source label",
          defaultMessage: "Source citation",
        })}
        required
      >
        <IndividualInput
          label={intl.formatMessage({
            description: "Source input label",
            defaultMessage: "Source",
          })}
          onChange={(source) => setForm((old) => ({ ...old, source }))}
          placeholder={intl.formatMessage({
            description: "Source input placeholder",
            defaultMessage: "Enter and select a source",
          })}
          type="sources"
          value={form.source}
        />
        <Input
          className="mt-4"
          label={intl.formatMessage({
            description: "Source location input label",
            defaultMessage: "Location",
          })}
          onChange={(e) =>
            setForm((old) => ({ ...old, sourceLocation: e.target.value }))
          }
          placeholder={intl.formatMessage({
            description: "Source location input placeholder",
            defaultMessage: "Enter the source location",
          })}
          value={form.sourceLocation || ""}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Authors label",
          defaultMessage: "Authors",
        })}
        help={intl.formatMessage({
          description: "Authors input help",
          defaultMessage: "Enter and select at least one author.",
        })}
        required
      >
        <IndividualRepeater
          label={intl.formatMessage({
            description: "Authors input label",
            defaultMessage: "Author",
          })}
          onChange={(authors) => setForm((old) => ({ ...old, authors }))}
          placeholder={intl.formatMessage({
            description: "Authors input placeholder",
            defaultMessage: "Enter and select an author",
          })}
          type="authors"
          values={form.authors}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Date label",
          defaultMessage: "Event date",
        })}
        help={intl.formatMessage({
          description: "Date field help text",
          defaultMessage:
            "Enter the optional date the event has happened. It is possible to either add a *single value* in case the event date is exactly known, or a *combination of dates* the event could have happened the earliest and the latest, in case the date is unclear. Either one can be ommited. In this case, the upper or lower boundary is unspecified. The dates have to be added in the format *YYYY-MM-DD*.",
        })}
      >
        <DateInput
          onChange={(dates) => setForm((old) => ({ ...old, dates }))}
          value={form.dates}
        />
      </Field>
      <Field
        help={intl.formatMessage({
          description: "Place help text",
          defaultMessage:
            "Enter and select the optional place the event happened at.",
        })}
        label={intl.formatMessage({
          description: "Place label",
          defaultMessage: "Event location",
        })}
      >
        <IndividualInput
          label={intl.formatMessage({
            description: "Place input label",
            defaultMessage: "Place",
          })}
          onChange={(place) => setForm((old) => ({ ...old, place }))}
          placeholder={intl.formatMessage({
            description: "Place input placeholder",
            defaultMessage: "Enter and select a place",
          })}
          type="places"
          value={form.place}
        />
      </Field>
      <Field
        help={intl.formatMessage({
          description: "Aspects help text",
          defaultMessage:
            "Enter the aspects that are used in this event as well as their usage type. Aspects are the things that actually happen in an event like the aquisition of a new status in society, the start of a job, becoming member of a family and so on.",
        })}
        label={intl.formatMessage({
          description: "Aspects label",
          defaultMessage: "Event aspects ",
        })}
      >
        <CoupleRepeater
          onChange={(aspects) => setForm((old) => ({ ...old, aspects }))}
          individualType="aspects"
          placeholder={intl.formatMessage({
            description: "Aspect input placeholder",
            defaultMessage: "Enter and select an aspect",
          })}
          propertyType={core.usesAspect}
          values={form.aspects}
        />
      </Field>
      <Field
        help={intl.formatMessage({
          description: "Other participants help text",
          defaultMessage:
            "Add all other participants in the event and their participation type. Participants can be both groups and persons.",
        })}
        label={intl.formatMessage({
          description: "Other participants label",
          defaultMessage: "Other participants",
        })}
      >
        <CoupleRepeater
          onChange={(participants) =>
            setForm((old) => ({ ...old, participants }))
          }
          individualType="actors"
          label={intl.formatMessage({
            description: "Other participants label",
            defaultMessage: "Actor",
          })}
          placeholder={intl.formatMessage({
            description: "Other participant input placeholder",
            defaultMessage: "Enter and select a group or person",
          })}
          propertyType={core.hasParticipant}
          values={form.participants}
        />
      </Field>
      <TextsField
        onChange={(texts) => setForm((old) => ({ ...old, texts }))}
        values={form.texts}
      />
      <CommentsField
        onChange={(comments) => setForm((old) => ({ ...old, comments }))}
        values={form.comments}
      />
      <EditorControls
        cancelUrl={baseUrl + (event?.idLocal || "")}
        loading={state.loading}
        mutate={() => {
          const authors = form.authors?.map((a) => a.id!) || [];
          if (!authors.includes(author.id)) {
            authors.push(author.id);
          }
          mutate({
            aspects:
              form.aspects?.map((p) => `${p.type.value}|${p.individual.id}`) ||
              [],
            authors,
            comments: serializeLiteral(form.comments),
            date: serializeDates(form.dates),
            labels: serializeLiteral(form.labels),
            mainParticipant: `${form.mainParticipant?.type.value}|${form.mainParticipant?.individual.id}`,
            otherParticipants:
              form.participants?.map(
                (p) => `${p.type.value}|${p.individual.id}`
              ) || [],
            place: form.place?.id || "",
            source: form.source?.id || "",
            sourceLocation: form.sourceLocation || "",
            texts: serializeLiteral(form.texts),
            types: types.map((t) => t.value || ""),
          });
        }}
        valid={validate(form, types)}
      />
    </EditorForm>
  );
};

export const EventEditor = ({ idLocal }: Props) => {
  const intl = useIntl();
  const { data, initialized, loading } = useEvent({
    idLocal: idLocal || "",
    paused: !idLocal,
  });
  const user = useUser();
  const literal = useLocaleLiteral();
  const create = idLocal === undefined;
  return initialized &&
    !loading &&
    user.initialized &&
    !user.loading &&
    user.data?.author ? (
    <>
      <Heading>
        {create ? (
          <FormattedMessage
            description="Create event heading"
            defaultMessage="Create new event"
          />
        ) : (
          <FormattedMessage
            description="New event heading"
            defaultMessage="Edit {event}"
            values={{ event: literal(data?.labels) }}
          />
        )}
      </Heading>
      <FormIntroduction>
        {intl.formatMessage({
          description: "Event form introduction",
          defaultMessage:
            "Please use the following form to enter the appropriate data for the desired event.",
        })}
      </FormIntroduction>
      <Editor
        event={data}
        author={{
          ...user.data.author,
          labels: user.data.labels,
          response: [{}] as JsonLdArray,
          types: [namespaces.core.author],
        }}
      />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
