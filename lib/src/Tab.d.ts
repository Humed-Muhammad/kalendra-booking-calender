import React from "react";
import type { ContentType } from "./types/type";
type Props = {
    options: string[];
    activeTab: string;
    onChange: (tab: string) => void;
    content?: ContentType | undefined;
};
export declare const Tab: ({ options, activeTab, content, onChange }: Props) => JSX.Element;
export declare const SlotRow: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const SlotButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {
    $selected?: boolean | undefined;
}>> & string;
export declare const ConfirmButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, never>> & string;
/** The time text inside a slot; rolls vertically when the time changes. */
export declare const SlotLabel: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<Pick<import("framer-motion").HTMLMotionProps<Tag>, string | number | symbol> & React.RefAttributes<HTMLSpanElement>, never>> & string & Omit<import("framer-motion").ForwardRefComponent<HTMLSpanElement, import("framer-motion").HTMLMotionProps<Tag>>, keyof React.Component<any, {}, any>>;
export {};
