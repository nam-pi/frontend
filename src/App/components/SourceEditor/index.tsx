import { useEditorTypes } from "App/hooks/useEditorTypes";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { serializeLiteral } from "App/utils/serializeLiteral";
import {
    LiteralString,
    Source,
    useSource,
    useSourceCreate,
    useSourceUpdate
} from "nampi-use-api";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { EditorControls } from "../EditorControls";
import { EditorForm } from "../EditorForm";
import { Field } from "../Field";
import { Heading } from "../Heading";
import { LabelsField } from "../LabelsField";
import { LiteralRepeater } from "../LiteralRepeater";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Paragraph } from "../Paragraph";
import { TextRepeater } from "../TextRepeater";
import { TextsField } from "../TextsField";
import { Type } from "../TypeInput";
import { TypeRepeater } from "../TypeRepeater";

interface Props {
  idLocal?: string;
}

interface FormState {
  comments: undefined | LiteralString[];
  labels: undefined | LiteralString[];
  sameAs: undefined | string[];
  texts: undefined | LiteralString[];
}

const validate = (form: FormState, types: Type[]) =>
  types.length > 0 && (form.labels?.length || 0) > 0;

const useForm = (
  baseUrl: string,
  defaultType: string,
  source: undefined | Source
) => {
  const history = useHistory();
  const [form, setForm] = useState<FormState>({
    comments: source?.comments,
    labels: source?.labels,
    sameAs: source?.sameAs,
    texts: source?.texts,
  });
  const [types, setTypes] = useEditorTypes(
    source ? { itemId: source.id } : { defaultType }
  );
  const update = useSourceUpdate(source?.idLocal || "");
  const create = useSourceCreate();
  let mutate = create[0];
  let state = create[1];
  if (source) {
    mutate = update[0];
    state = update[1];
  }
  useEffect(() => {
    if (!state.loading && state.data) {
      window.location.assign(baseUrl + state.data.idLocal);
    }
  }, [baseUrl, history, state, state.data, state.loading]);
  return { form, setForm, types, setTypes, mutate, state };
};

const Editor = ({ source }: { source?: Source }) => {
  const defaultType = namespaces.core.source;
  const baseUrl = "/sources/";
  const literal = useLocaleLiteral();
  const intl = useIntl();
  const { form, setForm, types, setTypes, mutate, state } = useForm(
    baseUrl,
    defaultType,
    source
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
          description: "Source type field label",
          defaultMessage: "Source types *",
        })}
      >
        <TypeRepeater onChange={setTypes} parent={defaultType} values={types} />
      </Field>
      <LabelsField
        onChange={(labels) => setForm((old) => ({ ...old, labels }))}
        required
        values={form.labels}
      />
      <TextsField
        onChange={(texts) => setForm((old) => ({ ...old, texts }))}
        values={form.texts}
      />
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
        cancelUrl={baseUrl + (source?.idLocal || "")}
        loading={state.loading}
        mutate={() =>
          mutate({
            types: types.map((t) => t.value || ""),
            texts: serializeLiteral(form.texts),
            comments: serializeLiteral(form.comments),
            labels: serializeLiteral(form.labels),
            sameAs: form.sameAs,
          })
        }
        valid={validate(form, types)}
      />
    </EditorForm>
  );
};

export const SourceEditor = ({ idLocal }: Props) => {
  const { data, initialized, loading } = useSource({
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
            description="Create source heading"
            defaultMessage="Create new source"
          />
        ) : (
          <FormattedMessage
            description="New source heading"
            defaultMessage="Edit {source}"
            values={{ source: literal(data?.labels) }}
          />
        )}
      </Heading>
      <Editor source={data} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
