import { useEditorTypes } from "App/hooks/useEditorTypes";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { serializeLiteral } from "App/utils/serializeLiteral";
import {
    Person,
    usePerson,
    usePersonCreate,
    usePersonUpdate
} from "nampi-use-api";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { EditorControls } from "../EditorControls";
import { EditorForm } from "../EditorForm";
import { Field } from "../Field";
import { Heading } from "../Heading";
import { LiteralRepeater } from "../LiteralRepeater";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Paragraph } from "../Paragraph";
import { TextRepeater } from "../TextRepeater";
import { TypeRepeater } from "../TypeRepeater";

interface Props {
  idLocal?: string;
}

const useData = (
  baseUrl: string,
  defaultType: string,
  person: undefined | Person
) => {
  const history = useHistory();
  const [form, setForm] = useState<Person>(person || ({} as Person));
  const [types, setTypes] = useEditorTypes(
    person ? { itemId: person.id } : { defaultType }
  );
  const update = usePersonUpdate(person?.idLocal || "");
  const create = usePersonCreate();
  let mutate = create[0];
  let state = create[1];
  if (person) {
    mutate = update[0];
    state = update[1];
  }
  const valid = useMemo(
    () => types.length > 0 && (form.labels?.length || 0) > 0,
    [form.labels?.length, types.length]
  );
  useEffect(() => {
    if (!state.loading && state.data) {
      history.push(baseUrl + state.data.idLocal);
    }
  }, [baseUrl, history, state, state.data, state.loading]);
  return { form, setForm, types, setTypes, mutate, state, valid };
};

const Editor = ({ person }: { person?: Person }) => {
  const defaultType = namespaces.core.person;
  const baseUrl = "/persons/";
  const literal = useLocaleLiteral();
  const intl = useIntl();
  const { form, setForm, types, setTypes, mutate, state, valid } = useData(
    baseUrl,
    defaultType,
    person
  );
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
          description: "Person type field label",
          defaultMessage: "Person types *",
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
          description: "Sameas field label",
          defaultMessage: "Same as URLs",
        })}
      >
        <TextRepeater
          label={intl.formatMessage({
            description: "Sameas input label",
            defaultMessage: "Same as",
          })}
          onChange={(sameAs) => setForm((old) => ({ ...old, sameAs }))}
          values={form.sameAs}
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
        cancelUrl={baseUrl + (person?.idLocal || "")}
        loading={state.loading}
        mutate={() =>
          mutate({
            types: types.map((t) => t.value || ""),
            texts: serializeLiteral(form.texts),
            comments: serializeLiteral(form.comments),
            labels: serializeLiteral(form.labels),
          })
        }
        valid={valid}
      />
    </EditorForm>
  );
};

export const PersonEditor = ({ idLocal }: Props) => {
  const { data, initialized, loading } = usePerson({
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
            description="Create person heading"
            defaultMessage="Create new person"
          />
        ) : (
          <FormattedMessage
            description="New person heading"
            defaultMessage="Edit {person}"
            values={{ person: literal(data?.labels) }}
          />
        )}
      </Heading>
      <Editor person={data} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
