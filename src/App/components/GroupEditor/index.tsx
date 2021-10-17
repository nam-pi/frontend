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
import { CommentsField } from "../CommentsField";
import { EditorControls } from "../EditorControls";
import { EditorForm } from "../EditorForm";
import { Field } from "../Field";
import { FormError } from "../FormError";
import { FormIntroduction } from "../FormIntroduction";
import { Heading } from "../Heading";
import { Individual, useIndividual } from "../IndividualInput";
import { IndividualRepeater } from "../IndividualRepeater";
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
  const intl = useIntl();
  const { form, setForm, types, setTypes, mutate, state } = useForm(
    baseUrl,
    defaultType,
    group
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
      <SameAsField
        onChange={(sameAs) => setForm((old) => ({ ...old, sameAs }))}
        values={form.sameAs}
      />
      <CommentsField
        onChange={(comments) => setForm((old) => ({ ...old, comments }))}
        values={form.comments}
      />
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
  const intl = useIntl();
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
      <FormIntroduction>
        {intl.formatMessage({
          description: "Group form introduction",
          defaultMessage:
            "Please use the following form to enter the appropriate data for the desired group. Please note that the fields marked with a *red star* are mandatory. Once you are finished, please click the *Submit* button at the bottom of the page to submit the form. To get help with individual fields, please move your mouse pointer above the little *question mark* icons.",
        })}
      </FormIntroduction>
      <Editor group={data} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
