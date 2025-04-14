import type { FontSizeProps, FontWeightProps } from 'styled-system';
import type { CommonProps } from '../common/types';
export interface TextProps extends CommonProps, FontWeightProps, FontSizeProps {
    truncate?: boolean;
    truncateLines?: number;
    variant?: 'light' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'body1' | 'body2' | 'body3' | 'body4' | 'body5' | 'body6' | 'charcoalBody' | 'numberHolder' | 'error';
}
