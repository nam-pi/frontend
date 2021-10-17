import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";

export const EditorForm = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => (
  <form className="grid grid-flow-row gap-6 divide-gray-100">
    <Heading level={2}>
      <FormattedMessage
        description="Form heading"
        defaultMessage="Input fields"
      />
    </Heading>
    {children}
  </form>
);
