import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { NampiError } from "nampi-use-api/dist/types";
import { FormattedMessage } from "react-intl";
import { Paragraph } from "../Paragraph";

interface Props {
  error: undefined | NampiError;
}

export const FormError = ({ error }: Props) => {
  const literal = useLocaleLiteral();
  return error ? (
    <Paragraph className="italic p-2 rounded bg-red-500 text-white">
      <span>
        <FormattedMessage description="Error heading" defaultMessage="Error" />
      </span>
      :&nbsp;
      {literal(error.description)}
    </Paragraph>
  ) : (
    <></>
  );
};
