import ReactMarkdown from "react-markdown";
import { Paragraph } from "../Paragraph";

interface Props {
  children: string;
}

export const FormIntroduction = ({ children }: Props) => (
  <Paragraph>
    <ReactMarkdown>{children}</ReactMarkdown>
  </Paragraph>
);
