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
import { CommentsField } from "../CommentsField";
import { EditorControls } from "../EditorControls";
import { EditorForm } from "../EditorForm";
import { FormError } from "../FormError";
import { FormIntroduction } from "../FormIntroduction";
import { Heading } from "../Heading";
import { LabelsField } from "../LabelsField";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { SameAsField } from "../SameAsField";
import { TextsField } from "../TextsField";
import { Type } from "../TypeInput";
import { TypesField } from "../TypesField";

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
  const { form, setForm, types, setTypes, mutate, state } = useForm(
    baseUrl,
    defaultType,
    source
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
      <TextsField
        onChange={(texts) => setForm((old) => ({ ...old, texts }))}
        values={form.texts}
      />
      <SameAsField
        onChange={(sameAs) => setForm((old) => ({ ...old, sameAs }))}
        values={form.sameAs}
      />
      <CommentsField
        onChange={(comments) => setForm((old) => ({ ...old, comments }))}
        values={form.comments}
      />
      <EditorControls
        cancelUrl={baseUrl + (source?.idLocal || "")}
        loading={state.loading}
        mutate={() =>
          mutate({
            types: types.map((t) => t.value || ""),
            texts: serializeLiteral(form.texts),
            comments: form.comments
              ? serializeLiteral(form.comments)
              : undefined,
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
  const intl = useIntl();
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
      <FormIntroduction>
        {intl.formatMessage({
          description: "Source form introduction",
          defaultMessage:
            "Please use the following form to enter the appropriate data for the desired source.",
        })}
      </FormIntroduction>
      <Editor source={data} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
