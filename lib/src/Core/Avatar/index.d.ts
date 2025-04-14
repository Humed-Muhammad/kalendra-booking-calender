import React from "react";
interface AvatarProps extends React.ComponentPropsWithoutRef<"div"> {
    src?: string;
    fallback?: string;
    alt?: string;
}
export declare const Avatar: React.FC<AvatarProps>;
export {};
