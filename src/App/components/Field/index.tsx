import {
    faAsterisk,
    faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ReactNode, useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Label } from "../Label";

export interface Props {
  children: ReactNode;
  className?: string;
  label: ReactNode;
  help?: string;
  required?: boolean;
}

export const Field = ({
  children,
  className,
  help,
  label,
  required = false,
}: Props) => {
  const [helpVisible, setHelpVisible] = useState(false);
  const toggleHelp = useCallback(() => setHelpVisible((old) => !old), []);
  return (
    <div>
      <div className="flex items-center">
        <Label className="text-lg">{label}</Label>
        {help && (
          <div className="flex relative ml-2">
            <FontAwesomeIcon
              className="text-gray-400 text-sm hover:text-gray-500 cursor-pointer"
              icon={faQuestionCircle}
              onMouseEnter={toggleHelp}
              onMouseLeave={toggleHelp}
            />
            {helpVisible && (
              <>
                <ReactMarkdown className="absolute bottom-8 -ml-14 bg-gray-100 py-2 px-4 rounded-md shadow-md max-w-max w-96 md:w-64 lg:w-sm">
                  {help}
                </ReactMarkdown>
                <svg
                  className="absolute fill-current text-gray-100 filter drop-shadow-md bottom-5 -ml-1.5 w-6"
                  viewBox="0 0 20 10"
                >
                  <polygon points="0,0 10,10 20,0" />
                  Sorry, your browser does not support inline SVG.
                </svg>
              </>
            )}
          </div>
        )}
        {required && (
          <FontAwesomeIcon
            className="ml-2 text-xs text-red-500"
            icon={faAsterisk}
          />
        )}
      </div>
      <div className={clsx(className, "mt-1")}>{children}</div>
    </div>
  );
};
