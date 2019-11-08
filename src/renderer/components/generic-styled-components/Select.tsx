import * as React from 'react';
import { ThemeSet } from 'styled-theming';
import styled from 'styled-components';
import {
    dropDownBoxBackgroundColor,
    dropDownBoxBorderColor,
    dropDownBoxHoverColor,
    dropDownBoxColor,
    dropDownBoxSelectedColor
} from '@/renderer/helpers/appearance';


interface ISelectProps {
    textColor?: string;
    borderColor?: string;
    selectedColor?: string;
    backgroundColor?: string;
    width?: string;
    paddingLeft?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
  }
  
export const SelectWrap = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: min-content;
    padding-left: ${(props: ISelectProps): string => props.paddingLeft ? props.paddingLeft : '0px'};
    padding-top: ${(props: ISelectProps): string => props.paddingTop ? props.paddingTop : '0px'};
    padding-right: ${(props: ISelectProps): string => props.paddingRight ? props.paddingRight : '0px'};
    padding-bottom: ${(props: ISelectProps): string => props.paddingBottom ? props.paddingBottom : '0px'};
    width: ${(props: ISelectProps): string => props.width ? props.width : '175px'};
    [class*='-container'] {
        width: 100%;
        [class*='-menu'] {
            color: Black !important;
        }
    }
    font-size: 1em !important;
    & > div {
      width: 160px;
      &:hover {
        cursor: pointer;
      }
    }
    [class*='-placeholder'],
    [class*='-singleValue'] {
      font-size: 0.8em !important;
    }
    [class*='-placeholder'] {
      font-size: 1em !important;
    }
    [class*='-control'] {
      min-height: 33px;
      max-height: 33px;
      background: ${(props: ISelectProps): ThemeSet | string =>
        props.backgroundColor
          ? props.backgroundColor
          : dropDownBoxBackgroundColor
          ? dropDownBoxBackgroundColor
          : '#ffffffff'};
      border-color: ${(props: ISelectProps): ThemeSet | string =>
        props.borderColor
          ? props.borderColor
          : dropDownBoxBorderColor
          ? dropDownBoxBorderColor
          : '#727272ff'};
    }
    [class*='-singleValue'] {
      color: ${(props: ISelectProps): ThemeSet | string =>
        props.textColor
          ? props.textColor
          : dropDownBoxColor
          ? dropDownBoxColor
          : '#f1f1f1ff'};
    }
  `;