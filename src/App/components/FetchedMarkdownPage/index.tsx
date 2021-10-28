import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinPath } from "App/utils/joinPath";
import { DEFAULT_LOCALE } from "I18n/constants";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
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
            img: ({ alt, src, ...props }) =>
              alt ? (
                <figure className="my-6">
                  <img
                    {...props}
                    alt={alt}
                    className="object-contain h-auto w-full rounded-lg"
                    src={
                      isRelativeUrl(src || "")
                        ? joinPath(baseUrl!, src || "")
                        : src
                    }
                  />
                  <figcaption className="text-center mt-4 italic">
                    <FormattedMessage
                      description="Figure caption"
                      defaultMessage="Figure: {alt}"
                      values={{ alt }}
                    />
                  </figcaption>
                </figure>
              ) : (
                <img
                  {...props}
                  alt={""}
                  className="my-6 object-contain h-auto w-full rounded-lg"
                  src={
                    isRelativeUrl(src || "")
                      ? joinPath(baseUrl!, src || "")
                      : src
                  }
                />
              ),
            a: ({ className, node, href, ...props }) =>
              className === "footnote-back" ? (
                <a {...props} href={href}>
                  {
                    <FontAwesomeIcon
                      className="text-xs ml-2 text-blue-400 hover:opacity-80"
                      icon={faUndo}
                    />
                  }
                </a>
              ) : href?.startsWith("http") ? (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  {...props}
                  className="text-blue-400 visited:text-purple-400 hover:opacity-80"
                  href={href}
                  target={href?.startsWith("http") ? "__blank" : undefined}
                />
              ) : (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <Link
                  className="text-blue-400 visited:text-purple-400 hover:opacity-80"
                  to={href || ""}
                >
                  {props.children}
                </Link>
              ),
            table: ({ node, ...props }) => (
              <table {...props} className="mt-4" />
            ),
            th: ({ node, ...props }) => (
              <th
                {...(props as any)}
                className="border-b border-blue-200 font-semibold"
              />
            ),
            section: ({ node, ...props }) => (
              <section {...props} className="mt-8" />
            ),
            hr: ({ node, ...props }) => (
              <hr {...props} className="border-blue-200" />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc list-inside mt-2" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="list-inside list-decimal mt-2" />
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
