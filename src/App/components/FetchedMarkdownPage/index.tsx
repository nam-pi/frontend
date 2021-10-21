import { joinPath } from "App/utils/joinPath";
import { DEFAULT_LOCALE } from "I18n/constants";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";
import { Heading } from "../Heading";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { PageContent } from "../PageContent";
import { Paragraph } from "../Paragraph";

interface Props {
  baseUrl: string;
}

const isRelativeUrl = (url: string): boolean =>
  url.match(/^https?:\/\//) === null;

export const FetchedMarkdownPage = ({ baseUrl }: Props) => {
  const { locale } = useIntl();
  const [text, setText] = useState<undefined | string>();
  useEffect(() => {
    const load = async () =>
      fetch(joinPath(baseUrl, `${locale}.md`))
        .catch(() => fetch(joinPath(baseUrl, `${DEFAULT_LOCALE}.md`)))
        .then((res) => res.text())
        .catch(() => "[NO TEXT FOUND]")
        .then(setText);
    if (!text) {
      load();
    }
  }, [baseUrl, locale, text]);
  return !text ? (
    <LoadingPlaceholder />
  ) : (
    <PageContent className="max-w-3xl flex-col">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <Heading level={1} className="mb-4">
              {children}
            </Heading>
          ),
          h2: ({ children }) => <Heading level={2}>{children}</Heading>,
          h3: ({ children }) => <Heading level={3}>{children}</Heading>,
          h4: ({ children }) => <Heading level={4}>{children}</Heading>,
          p: ({ children }) => (
            <Paragraph className="mb-2">{children}</Paragraph>
          ),
          img: ({ alt, src, ...props }) => (
            <img
              {...props}
              alt={alt || ""}
              className="object-contain h-64 w-full"
              src={
                isRelativeUrl(src || "") ? joinPath(baseUrl, src || "") : src
              }
            />
          ),
          a: ({ node, children, ...props }) => (
            <a className="text-blue-400 visited:text-purple-400" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </PageContent>
  );
};
