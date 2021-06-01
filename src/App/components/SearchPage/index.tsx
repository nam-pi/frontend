import { useLocation } from "react-router";

const useSearchParam = (): undefined | string => {
  return new URLSearchParams(useLocation().search).get("s") || undefined;
};

export const SearchPage = () => {
  return <div>[TBD]</div>;
};
