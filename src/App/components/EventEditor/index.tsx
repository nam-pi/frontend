import { useEditorTypes } from "App/hooks/useEditorTypes";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { serializeLiteral } from "App/utils/serializeLiteral";
import {
    Event,
    LiteralString,
    useEvent,
    useEventCreate,
    useEventUpdate
} from "nampi-use-api";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { EditorControls } from "../EditorControls";
import { EditorForm } from "../EditorForm";
import { Field } from "../Field";
import { Heading } from "../Heading";
import {
    Individual,
    IndividualsInput,
    useIndividual
} from "../IndividualsInput";
import { Input } from "../Input";
import { LiteralRepeater } from "../LiteralRepeater";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Paragraph } from "../Paragraph";
import { TypeRepeater } from "../TypeRepeater";

interface Props {
  idLocal?: string;
}

interface FormState {
  comments: undefined | LiteralString[];
  labels: undefined | LiteralString[];
  mainParticipant: undefined | Individual;
  place: undefined | Individual;
  source: undefined | Individual;
  sourceLocation: undefined | string;
  texts: undefined | LiteralString[];
}

const useForm = (
  baseUrl: string,
  defaultType: string,
  event: undefined | Event
) => {
  const history = useHistory();
  const individual = useIndividual();
  const [form, setForm] = useState<FormState>({
    comments: event?.comments,
    labels: event?.labels,
    mainParticipant: individual(event?.mainParticipant),
    place: individual(event?.place),
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
  const valid = useMemo(
    () =>
      types.length > 0 &&
      form.labels !== undefined &&
      form.labels.length > 0 &&
      form.mainParticipant?.id !== undefined &&
      form.source?.id !== undefined &&
      form.sourceLocation !== undefined &&
      form.sourceLocation.replace(/\s/g, "").length > 0,
    [
      form.labels,
      form.mainParticipant?.id,
      form.source?.id,
      form.sourceLocation,
      types.length,
    ]
  );
  useEffect(() => {
    if (!state.loading && state.data) {
      window.location.assign(baseUrl + state.data.idLocal);
    }
  }, [baseUrl, history, state, state.data, state.loading]);
  return { form, setForm, types, setTypes, mutate, state, valid };
};

const Editor = ({ event }: { event?: Event }) => {
  const defaultType = namespaces.core.event;
  const baseUrl = "/events/";
  const literal = useLocaleLiteral();
  const intl = useIntl();
  const { form, setForm, types, setTypes, mutate, state, valid } = useForm(
    baseUrl,
    defaultType,
    event
  );
  console.log(form, types);
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
          description: "Main participant label",
          defaultMessage: "Main participant *",
        })}
      >
        <IndividualsInput
          label={intl.formatMessage({
            description: "Main participant input label",
            defaultMessage: "Label",
          })}
          onChange={(mainParticipant) =>
            setForm((old) => ({ ...old, mainParticipant }))
          }
          type="persons"
          value={form.mainParticipant}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Source label",
          defaultMessage: "Source *",
        })}
      >
        <IndividualsInput
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
          value={form.sourceLocation}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Place label",
          defaultMessage: "Place",
        })}
      >
        <IndividualsInput
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
            aspects: [],
            authors: [],
            comments: serializeLiteral(form.comments),
            date: "",
            labels: serializeLiteral(form.labels),
            mainParticipant: "",
            otherParticipants: [],
            place: "",
            source: "",
            sourceLocation: "",
            texts: serializeLiteral(form.texts),
            types: types.map((t) => t.value || ""),
          })
        }
        valid={valid}
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
