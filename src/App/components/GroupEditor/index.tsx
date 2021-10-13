import { useEditorTypes } from "App/hooks/useEditorTypes";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { serializeLiteral } from "App/utils/serializeLiteral";
import {
    Group,
    LiteralString,
    useGroup,
    useGroupCreate,
    useGroupUpdate
} from "nampi-use-api";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { EditorControls } from "../EditorControls";
import { EditorForm } from "../EditorForm";
import { Field } from "../Field";
import { Heading } from "../Heading";
import { Individual, useIndividual } from "../IndividualInput";
import { IndividualRepeater } from "../IndividualRepeater";
import { LiteralRepeater } from "../LiteralRepeater";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Paragraph } from "../Paragraph";
import { TextRepeater } from "../TextRepeater";
import { Type } from "../TypeInput";
import { TypeRepeater } from "../TypeRepeater";

interface Props {
  idLocal?: string;
}

interface FormState {
  comments: undefined | LiteralString[];
  labels: undefined | LiteralString[];
  partOf: undefined | Individual[];
  sameAs: undefined | string[];
  texts: undefined | LiteralString[];
}

const validate = (form: FormState, types: Type[]) =>
  types.length > 0 && (form.labels?.length || 0) > 0;

const useForm = (
  baseUrl: string,
  defaultType: string,
  group: undefined | Group
) => {
  const history = useHistory();
  const individual = useIndividual();
  const [form, setForm] = useState<FormState>({
    comments: group?.comments,
    labels: group?.labels,
    partOf: group?.isPartOf?.map((g) => individual(g)!),
    sameAs: group?.sameAs,
    texts: group?.texts,
  });
  const [types, setTypes] = useEditorTypes(
    group ? { itemId: group.id } : { defaultType }
  );
  const update = useGroupUpdate(group?.idLocal || "");
  const create = useGroupCreate();
  let mutate = create[0];
  let state = create[1];
  if (group) {
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

const Editor = ({ group }: { group?: Group }) => {
  const defaultType = namespaces.core.group;
  const baseUrl = "/groups/";
  const literal = useLocaleLiteral();
  const intl = useIntl();
  const { form, setForm, types, setTypes, mutate, state } = useForm(
    baseUrl,
    defaultType,
    group
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
          description: "Group type field label",
          defaultMessage: "Group types *",
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
          description: "Part of part of",
          defaultMessage: "Part of *",
        })}
      >
        <IndividualRepeater
          label={intl.formatMessage({
            description: "Part of input label",
            defaultMessage: "Label",
          })}
          onChange={(partOf) => setForm((old) => ({ ...old, partOf }))}
          type="groups"
          values={form.partOf}
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
        cancelUrl={baseUrl + (group?.idLocal || "")}
        loading={state.loading}
        mutate={() =>
          mutate({
            types: types.map((t) => t.value || ""),
            texts: serializeLiteral(form.texts),
            comments: serializeLiteral(form.comments),
            labels: serializeLiteral(form.labels),
            sameAs: form.sameAs,
            partOf: form.partOf?.map((p) => p.id!),
          })
        }
        valid={validate(form, types)}
      />
    </EditorForm>
  );
};

export const GroupEditor = ({ idLocal }: Props) => {
  const { data, initialized, loading } = useGroup({
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
            description="Create group heading"
            defaultMessage="Create new group"
          />
        ) : (
          <FormattedMessage
            description="New group heading"
            defaultMessage="Edit {group}"
            values={{ group: literal(data?.labels) }}
          />
        )}
      </Heading>
      <Editor group={data} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
