import { ImgHTMLAttributes } from "react";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {}

export const Image = ({ alt, ...props }: Props) => <img {...props} alt={alt} />;
