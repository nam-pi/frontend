import { useEditorTypes } from "App/hooks/useEditorTypes";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { serializeLiteral } from "App/utils/serializeLiteral";
import { format } from "date-fns";
import {
    Event,
    Hierarchy,
    LiteralString,
    useEvent,
    useEventCreate,
    useEventUpdate,
    useHierarchy
} from "nampi-use-api";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { Couple, CoupleInput } from "../CoupleInput";
import { CoupleRepeater } from "../CoupleRepeater";
import { DateInput, Dates } from "../DateInput";
import { EditorControls } from "../EditorControls";
import { EditorForm } from "../EditorForm";
import { Field } from "../Field";
import { Heading } from "../Heading";
import { Individual, IndividualInput, useIndividual } from "../IndividualInput";
import { IndividualRepeater } from "../IndividualRepeater";
import { Input } from "../Input";
import { LiteralRepeater } from "../LiteralRepeater";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Paragraph } from "../Paragraph";
import { Type } from "../TypeInput";
import { TypeRepeater } from "../TypeRepeater";

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
    ? `${dates.start}-${dates.end}`
    : dates.start
    ? `${dates.start}-`
    : dates.end
    ? `-${dates.end}`
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
  event: undefined | Event
) => {
  const history = useHistory();
  const individual = useIndividual();
  const [form, setForm] = useState<FormState>({
    aspects: undefined,
    authors: event?.act.authors.map((a) => individual(a)!),
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

const Editor = ({ event }: { event?: Event }) => {
  const defaultType = core.event;
  const baseUrl = "/events/";
  const literal = useLocaleLiteral();
  const intl = useIntl();
  const { form, setForm, types, setTypes, mutate, state } = useForm(
    baseUrl,
    defaultType,
    event
  );
  console.log(form);
  return (
    <EditorForm>
      {state.error && (
        <Paragraph className="italic p-2 rounded bg-red-500 text-white">
          <span>
            <FormattedMessage
              description="Error heading"
              defaultMessage="Error"
            />
          </span>
          :&nbsp;
          {literal(state.error.description)}
        </Paragraph>
      )}
      <Field
        label={intl.formatMessage({
          description: "Event type field label",
          defaultMessage: "Event types *",
        })}
      >
        <TypeRepeater onChange={setTypes} parent={defaultType} values={types} />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Labels field label",
          defaultMessage: "Labels *",
        })}
      >
        <LiteralRepeater
          label={intl.formatMessage({
            description: "Label input label",
            defaultMessage: "Label",
          })}
          onChange={(labels) => setForm((old) => ({ ...old, labels }))}
          values={form.labels}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Date label",
          defaultMessage: "Date",
        })}
      >
        <DateInput
          onChange={(dates) => setForm((old) => ({ ...old, dates }))}
          value={form.dates}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Text field label",
          defaultMessage: "Text",
        })}
      >
        <LiteralRepeater
          label={intl.formatMessage({
            description: "Text input label",
            defaultMessage: "Texts",
          })}
          onChange={(texts) => setForm((old) => ({ ...old, texts }))}
          values={form.texts}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Authors label",
          defaultMessage: "Authors *",
        })}
      >
        <IndividualRepeater
          label={intl.formatMessage({
            description: "Authors input label",
            defaultMessage: "Label",
          })}
          onChange={(authors) => setForm((old) => ({ ...old, authors }))}
          type="authors"
          values={form.authors}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Main participant label",
          defaultMessage: "Main participant *",
        })}
      >
        <CoupleInput
          onChange={(mainParticipant) =>
            setForm((old) => ({ ...old, mainParticipant }))
          }
          individualType="persons"
          propertyType={core.hasMainParticipant}
          value={form.mainParticipant}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Other participants label",
          defaultMessage: "Other participants ",
        })}
      >
        <CoupleRepeater
          onChange={(participants) =>
            setForm((old) => ({ ...old, participants }))
          }
          individualType="actors"
          propertyType={core.hasParticipant}
          values={form.participants}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Aspects label",
          defaultMessage: "Aspects ",
        })}
      >
        <CoupleRepeater
          onChange={(aspects) => setForm((old) => ({ ...old, aspects }))}
          individualType="aspects"
          propertyType={core.usesAspect}
          values={form.aspects}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Source label",
          defaultMessage: "Source *",
        })}
      >
        <IndividualInput
          label={intl.formatMessage({
            description: "Source input label",
            defaultMessage: "Label",
          })}
          onChange={(source) => setForm((old) => ({ ...old, source }))}
          type="sources"
          value={form.source}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Source location label",
          defaultMessage: "Source location *",
        })}
      >
        <Input
          label={intl.formatMessage({
            description: "Source location input label",
            defaultMessage: "Text",
          })}
          onChange={(e) =>
            setForm((old) => ({ ...old, sourceLocation: e.target.value }))
          }
          value={form.sourceLocation || ""}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Place label",
          defaultMessage: "Place",
        })}
      >
        <IndividualInput
          label={intl.formatMessage({
            description: "Place input label",
            defaultMessage: "Label",
          })}
          onChange={(place) => setForm((old) => ({ ...old, place }))}
          type="places"
          value={form.place}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Comments field label",
          defaultMessage: "Comments",
        })}
      >
        <LiteralRepeater
          label={intl.formatMessage({
            description: "Comment input label",
            defaultMessage: "Comment",
          })}
          onChange={(comments) => setForm((old) => ({ ...old, comments }))}
          type="multiline"
          values={form.comments}
        />
      </Field>
      <EditorControls
        cancelUrl={baseUrl + (event?.idLocal || "")}
        loading={state.loading}
        mutate={() =>
          mutate({
            aspects:
              form.aspects?.map((p) => `${p.type.value}|${p.individual.id}`) ||
              [],
            authors: form.authors?.map((a) => a.id!) || [],
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
          })
        }
        valid={validate(form, types)}
      />
    </EditorForm>
  );
};

export const EventEditor = ({ idLocal }: Props) => {
  const { data, initialized, loading } = useEvent({
    idLocal: idLocal || "",
    paused: !idLocal,
  });
  const literal = useLocaleLiteral();
  const create = idLocal === undefined;
  return initialized && !loading ? (
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
      <Editor event={data} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
