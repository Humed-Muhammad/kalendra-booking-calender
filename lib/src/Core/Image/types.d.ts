import type { CommonProps } from "../common/types";
export interface ImageProps extends CommonProps {
    variant?: "top-rounded" | "rounded";
    width?: Array<any> | any;
    height?: Array<any> | any;
}
