import styled from 'styled-components';
import { ThemeSet } from 'styled-theming'; 
import {
  textInputBackgroundColor, 
  textInputColor,
  textInputPlaceholderColor,
  accentColor
} from '@/renderer/helpers/appearance';

interface IProps {
  width?: string;
  textColor?: string;
  backgroundColor?: string;
  shadowColor?: string;
  shadowHoverColor?: string;
}

/**
 * @description custom input
 */
export const StyledInput = styled.input`
  width: ${(props: IProps): string => (props.width ? props.width : 'auto')};
  outline: none !important;
  border-radius: 10px;
  box-shadow: 2px 2px 4px
    ${(props: IProps): string =>
      props.shadowColor ? props.shadowColor : 'rgba(0,0,0,0.15)'};
  border: 0px;
  padding: 5px;
  padding-left: 10px;
  &:hover,
  &:active,
  &:focus {
    box-shadow: 2px 2px 4px
      ${(props: IProps): ThemeSet | string =>
        props.shadowHoverColor ? props.shadowHoverColor : 
        accentColor ? accentColor : '#922ccedd'};
  };
  background:  ${(props: IProps): ThemeSet | string => 
    props.backgroundColor ? props.backgroundColor : 
      textInputBackgroundColor ? textInputBackgroundColor : '#ffffffff'};
  color: ${(props: IProps): ThemeSet | string => 
    props.textColor ? props.textColor : 
      textInputColor ? textInputColor : '#000000ff'}
`;
