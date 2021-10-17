import { useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";

interface Props {
  children: string;
}

export const FormIntroduction = ({ children }: Props) => {
  const intl = useIntl();
  return (
    <div className="px-4 py-2 border-solid border-2 border-gray-300 rounded-md text-sm">
      <ReactMarkdown>{children}</ReactMarkdown>
      <ReactMarkdown className="mt-2">
        {intl.formatMessage({
          description: "Form help text",
          defaultMessage:
            "Note: The fields marked with a *red star* are mandatory. Once you are satisfied with the form content, please click the *Submit* button at the bottom of the page to submit the form. To get help with individual fields, please move your mouse pointer above the little *question mark* icons.",
        })}
      </ReactMarkdown>
    </div>
  );
};
