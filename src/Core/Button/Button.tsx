import styled from 'styled-components'
import { CommonProps } from '../common/types'
import { commonComposes } from '../common'

export const Button = styled('button')<CommonProps>`
  border: none;
  color: ${(props: any) => props.color || props.theme.colors.text};
  padding: 4px;
  cursor: pointer;
  border-radius: 8px;
  padding-right: 12px;
  padding-left: 12px;
  background: ${(props: any) => (props.selected ? props.theme.colors.dayBg : `none`)};
  //   min-width: 80px;
  &:hover {
    ${(props) => props._hover};
  }
  ${commonComposes()}
`
