import { joinPath } from "App/utils/joinPath";
import { DEFAULT_LOCALE } from "I18n/constants";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Footer } from "../Footer";
import { Heading } from "../Heading";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { PageContent } from "../PageContent";
import { Paragraph } from "../Paragraph";

interface Props {
  baseUrl: undefined | string;
}

const DEFAULT_TEXT = `
# INFO: MISSING TEXT

This is the a content page of this NAMPI installation. Please set the appropriate content environment variable to replace this text. For more information refer to the NAMPI [GitHub repository](https://github.com/nam-pi/frontend).
`;

const isRelativeUrl = (url: string): boolean =>
  url.match(/^https?:\/\//) === null;

export const FetchedMarkdownPage = ({ baseUrl }: Props) => {
  const { locale } = useIntl();
  const [text, setText] = useState<undefined | string>(
    baseUrl ? undefined : DEFAULT_TEXT
  );
  useEffect(() => {
    const load = async () =>
      fetch(joinPath(baseUrl!, `${locale}.md`))
        .catch(() => fetch(joinPath(baseUrl!, `${DEFAULT_LOCALE}.md`)))
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
    <>
      <PageContent className="max-w-3xl flex-col flex-grow mb-12">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <Heading {...props} level={1} className="my-4 first:mt-2" />
            ),
            h2: ({ node, ...props }) => (
              <Heading
                {...props}
                level={2}
                className="mt-4 border-b border-blue-200 pb-1"
              />
            ),
            h3: ({ node, ...props }) => (
              <Heading {...props} level={3} className="mt-4" />
            ),
            h4: ({ node, ...props }) => (
              <Heading {...props} level={4} className="mt-2" />
            ),
            p: ({ node, ...props }) => (
              <Paragraph {...props} className="mt-2" />
            ),
            img: ({ alt, src, ...props }) => (
              <img
                {...props}
                alt={alt || ""}
                className="object-contain h-64 w-full"
                src={
                  isRelativeUrl(src || "") ? joinPath(baseUrl!, src || "") : src
                }
              />
            ),
            a: ({ node, ...props }) => (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a className="text-blue-400 visited:text-purple-400" {...props} />
            ),
            table: ({ node, ...props }) => (
              <table {...props} className="border-separate mt-2" />
            ),
            th: ({ node, ...props }) => (
              <th
                {...(props as any)}
                className="rounded-md bg-gray-400 text-white"
              />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc list-inside mt-2" />
            ),
          }}
          remarkPlugins={[remarkGfm]}
        >
          {text}
        </ReactMarkdown>
      </PageContent>
      <Footer />
    </>
  );
};
