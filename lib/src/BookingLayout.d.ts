/// <reference types="react" />
export declare const META_WIDTH = 280;
export declare const MAIN_WIDTH = 460;
export declare const SLOTS_WIDTH = 280;
export declare const DESKTOP = "@media (min-width: 1080px)";
/** The card. On desktop its width animates when the time column opens. */
export declare const Shell: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {
    $expanded: boolean;
}>> & string;
export declare const MetaColumn: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const MainColumn: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {
    $hidden?: boolean | undefined;
}>> & string;
export declare const SlotsColumn: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {
    $expanded: boolean;
    $hidden?: boolean | undefined;
}>> & string;
export declare const SlotsInner: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<Pick<import("framer-motion").HTMLMotionProps<Tag>, string | number | symbol> & import("react").RefAttributes<HTMLDivElement>, never>> & string & Omit<import("framer-motion").ForwardRefComponent<HTMLDivElement, import("framer-motion").HTMLMotionProps<Tag>>, keyof import("react").Component<any, {}, any>>;
export declare const SlotsHeader: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const DayHeading: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, never>> & string;
export declare const SlotsScroller: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const SlotList: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<Pick<import("framer-motion").HTMLMotionProps<Tag>, string | number | symbol> & import("react").RefAttributes<HTMLUListElement>, never>> & string & Omit<import("framer-motion").ForwardRefComponent<HTMLUListElement, import("framer-motion").HTMLMotionProps<Tag>>, keyof import("react").Component<any, {}, any>>;
export declare const EmptySlots: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<Pick<import("framer-motion").HTMLMotionProps<Tag>, string | number | symbol> & import("react").RefAttributes<HTMLDivElement>, never>> & string & Omit<import("framer-motion").ForwardRefComponent<HTMLDivElement, import("framer-motion").HTMLMotionProps<Tag>>, keyof import("react").Component<any, {}, any>>;
export declare const FormArea: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<Pick<import("framer-motion").HTMLMotionProps<Tag>, string | number | symbol> & import("react").RefAttributes<HTMLDivElement>, never>> & string & Omit<import("framer-motion").ForwardRefComponent<HTMLDivElement, import("framer-motion").HTMLMotionProps<Tag>>, keyof import("react").Component<any, {}, any>>;
export declare const FormInner: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const HostName: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>, never>> & string;
export declare const EventTitle: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, never>> & string;
export declare const DetailList: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const DetailRow: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const DetailText: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const DurationChips: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const DurationChip: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {
    $active: boolean;
}>> & string;
export declare const AvatarWrap: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
/** A shimmering placeholder block. Size it with width/height/radius props. */
export declare const Skeleton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, {
    $w?: string | number | undefined;
    $h?: string | number | undefined;
    $r?: string | number | undefined;
}>> & string;
export declare const SkeletonStack: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {
    $gap?: number | undefined;
}>> & string;
export declare const MonthEmptyOverlay: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<Pick<import("framer-motion").HTMLMotionProps<Tag>, string | number | symbol> & import("react").RefAttributes<HTMLDivElement>, never>> & string & Omit<import("framer-motion").ForwardRefComponent<HTMLDivElement, import("framer-motion").HTMLMotionProps<Tag>>, keyof import("react").Component<any, {}, any>>;
export declare const MonthEmptyCard: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const MonthEmptyButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, never>> & string;
/** Stacks its children in one grid cell so lists can crossfade in place. */
export declare const SlotStack: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
