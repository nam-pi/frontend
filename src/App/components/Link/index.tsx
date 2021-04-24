import clsx from "clsx";
import { Link as RouterLink, LinkProps } from "react-router-dom";

interface Props extends LinkProps {}

export const Link = ({ className, ...props }: Props) => (
  <RouterLink
    {...props}
    className={clsx("text-blue-500", "visited:text-purple-500", className)}
  />
);
