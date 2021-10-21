import clsx from "clsx";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const PageContent = ({ className, ...props }: Props) => (
  <div
    {...props}
    className={clsx("flex w-full mx-auto px-2 my-4 sm:px-6 lg:px-8", className)}
  />
);
