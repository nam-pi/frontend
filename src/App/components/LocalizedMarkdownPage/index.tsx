import { TextDefinitions } from "App/constants";
import { DEFAULT_LOCALE } from "I18n/constants";
import { useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";
import {
  NormalComponents,
  SpecialComponents,
} from "react-markdown/src/ast-to-react";
import { Heading } from "../Heading";
import { Paragraph } from "../Paragraph";

interface Props {
  texts: TextDefinitions;
}

const components: Partial<NormalComponents & SpecialComponents> = {
  h1: ({ children }) => (
    <Heading level={1} className="mb-4">
      {children}
    </Heading>
  ),
  h2: ({ children }) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }) => <Heading level={4}>{children}</Heading>,
  p: ({ children }) => <Paragraph className="mb-2">{children}</Paragraph>,
  a: ({ node, children, ...props }) => (
    <a className="text-blue-500 visited:text-purple-500" {...props}>
      {children}
    </a>
  ),
};

export const LocalizedMarkdownPage = ({ texts }: Props) => {
  const { locale, formatMessage } = useIntl();
  const text =
    texts[locale] ||
    texts[DEFAULT_LOCALE] ||
    formatMessage({
      description: "Undefined content placeholder",
      defaultMessage: "[No text defined for this page]",
    });
  return (
    <div className="max-w-3xl">
      <ReactMarkdown components={components}>{text}</ReactMarkdown>
    </div>
  );
};
