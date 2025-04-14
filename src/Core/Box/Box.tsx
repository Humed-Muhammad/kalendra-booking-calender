import { variant } from 'styled-system'
import { commonComposes } from '../common'
import type { CommonProps } from '../common/types'
import styled from 'styled-components'
import { ReactNode, RefObject, useMemo } from 'react'

export interface BoxProps extends CommonProps {
  variant?: 'modal-container'
  hideScrollBar?: boolean
}
export const Box = styled('div')<BoxProps>(
  (props) => ({
    '&:hover': props._hover,
    transition: 'all 0.1s ease-in-out',
    ...(props.hideScrollBar && {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      '&::-webkit-scrollbar-thumb': {
        display: 'none',
      },
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
    }),
  }),
  variant({
    variants: {
      'modal-container': {
        background: 'white',
        // padding: '24px',
        height: 'auto',
        position: 'absolute',
        borderRadius: '16px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
        padding: ['10px', '10px', '10px', '24px'],
        width: ['95%', '95%', '95%', '90%', '809px'],
      },
    },
  }),
  commonComposes(),
)

export const Flex = styled(Box)({
  display: 'flex',
})

export const CenterRow = styled(Flex)({
  alignItems: 'center',
})

export const CenterColumn = styled(Flex)({
  justifyContent: 'center',
  flexDirection: 'column',
})

export const Container = styled(Flex)`
  justify-content: ${(props) => props.justifyContent || 'center'};
  align-items: ${(props) => props.alignItems || 'center'};
`
export const ModalContentContainer = styled(Box)({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const ModalContent = styled(Box)({
  maxHeight: '90%',
  width: '50%',
  display: 'flex',
  justifyContent: 'center',
  background: 'white',
})

export const ChipComponent = styled(Container)({
  borderRadius: '50px',
  minWidth: 'max-content',
  height: 'fit-content',
})

export type ChipTypes = 'error' | 'success' | 'warning' | 'info' | 'default' | 'secondary'
interface ChipsProps extends BoxProps {
  value: string | number | undefined | ReactNode
  type?: ChipTypes
  ref?: RefObject<HTMLDivElement>
  onClick?: () => void
  id?: string
  rightAdornment?: React.ReactNode
  leftAdornment?: React.ReactNode
  textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none'
}
export const Chip = ({ type = 'default', value, rightAdornment, textTransform, leftAdornment, ...rest }: ChipsProps) => {
  const style = useMemo(() => {
    switch (type) {
      case 'info':
        return {
          background: '#E0F2FE',
          color: '#0C4A6E',
        }
      case 'success':
        return { background: '#F8FFEB', color: '#3B8400' }

      case 'warning':
        return { background: '#FFFBE4', color: '#B19607' }

      case 'error':
        return { background: '#FFE4E4', color: '#E51616' }
      case 'secondary':
        return { background: '#fcf3f3', color: '#e59693' }
      default:
        return { background: '#F6F0FC', color: '#8450a0' }
    }
  }, [type])
  return (
    <ChipComponent
      style={{
        textTransform,
      }}
      minWidth="fit-content"
      backgroundColor={style.background}
      color={style.color}
      padding="8px 16px"
      {...rest}
    >
      {leftAdornment}
      {value}
      {rightAdornment}
    </ChipComponent>
  )
}

interface OverflowProps {
  showScrollbar?: boolean
}

export const Overflow = styled(Box)<OverflowProps>`
  overflow: auto;

  ${({ showScrollbar }) =>
    !showScrollbar &&
    `
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  `}
`
