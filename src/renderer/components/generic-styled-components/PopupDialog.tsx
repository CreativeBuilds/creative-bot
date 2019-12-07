import styled from 'styled-components';
import { ThemeSet } from 'styled-theming';
import { fadeIn } from '../animations/fadeIn';
import {
  popupTextColor,
  popupBackgroundColor,
  popupTabViewColor,
  popupTabViewBackgroundColor,
  textInputBackgroundColor,
  textInputColor,
  textInputPlaceholderColor,
  accentColor,
  popupButtonDisabledBackgroundColor
} from '@/renderer/helpers/appearance';

interface IPropsDialog {
  minWidth?: string;
  width?: string;
  minHeight?: string;
  height?: string;
}

/**
 * @description Generic white background popup dialog
 */
export const PopupDialog = styled.div`
  position: relative;
  background: ${(): ThemeSet | string =>
    popupBackgroundColor ? popupBackgroundColor : '#f1f1f1'};
  min-width: ${(props: IPropsDialog) =>
    !!props.minWidth ? props.minWidth : '350px'};
  width: ${(props: IPropsDialog) => (!!props.width ? props.width : '350px')};
  min-height: 'unset';
  height: ${(props: IPropsDialog) =>
    !!props.height ? props.height : 'fit-content'};
  max-height: 95%;
  overflow-y: auto;
  color: ${() => (popupTextColor ? popupTextColor : '#000')};
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 10px;
  animation: ${fadeIn} 0.3s linear;
  animation-fill-mode: forwards;
`;

export const PopupDialogBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
`;

interface ITitleProps {
  center?: boolean;
}

/**
 * @description The back icon in the top left of the PopupDialog, allows for navigation
 */
export const PopupDialogBackIcon = styled.div`
  position: absolute;
  top: 5px;
  left: 10px;
  height: 30px;
  width: 30px;
  font-size: 30px;
  & > svg {
    height: 30px;
    width: 30px;
    font-size: 30px;
    &:hover {
      cursor: pointer;
    }
  }
`;

/**
 * @description The exit icon in the top right of the PopupDialog, allows for closing popup
 */
export const PopupDialogExitIcon = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  height: 30px;
  width: 30px;
  font-size: 30px;
  & > svg {
    height: 30px;
    width: 30px;
    font-size: 30px;
    &:hover {
      cursor: pointer;
    }
  }
`;

/**
 * @description Title of popup, not always needed
 */
export const PopupDialogTitle = styled.h1`
  max-width: 100%;
  font-size: 1.7em;
  font-weight: 100;
  margin: 0;
  margin-bottom: 20px;
  text-align: ${(props: ITitleProps) => (!!props.center ? 'center' : 'auto')};
`;

/**
 * @description Used for any filler text in a popup
 */
export const PopupDialogText = styled.div`
  width: 95%;
  font-size: 1.2em;
  font-weight: 100;
  margin: auto;
  margin-bottom: 10px;
  text-align: ${(props: ITitleProps) => (!!props.center ? 'center' : 'unset')};
`;

interface IInputProps {
  textColor?: string;
  backgroundColor?: string;
  disabled?: boolean;
}

/**
 * @description User for any input of text needed
 */
export const PopupDialogInput = styled.input`
  border: 0px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
  width: calc(100% - 10px);
  font-weight: 100;
  border-radius: 10px;
  padding: 5px;
  font-size: 1em;
  &,
  &:active {
    outline: none !important;
  }
  ${(props: IInputProps): string =>
    props.disabled
      ? `
        &:hover, &:active{
          cursor: normal;
        }
      `
      : ''}
  
  background: ${(props: IInputProps): ThemeSet | string =>
    props.backgroundColor
      ? props.backgroundColor
      : textInputBackgroundColor
      ? textInputBackgroundColor
      : '#ffffffff'};
  color: ${(props: IInputProps): ThemeSet | string =>
    props.textColor
      ? props.textColor
      : textInputColor
      ? textInputColor
      : '#000000ff'};
`;

export const PopupDialogPadding = styled.div`
  height: 60px;
  width: 100%;
`;

/**
 * @description Wraps input fields that need a title/helper text
 */
export const PopupDialogInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 85%;
  margin: auto;
  margin-bottom: 10px;
  & > div[class*='-container'] {
    width: 100%;
  }
`;
/**
 * @description Name above input slot
 */
export const PopupDialogInputName = styled.div`
  font-size: 1.1em;
  font-weight: 100;
`;

interface IInfoProps {
  error?: boolean;
  isHidden?: boolean;
}
/**
 * @param props pass error to show as red text or default inherit color
 * @description Helper text beneath input
 */
export const PopupDialogInputInfo = styled.div`
  font-size: 1em;
  font-weight: 100;
  color: ${(props: IInfoProps) => (!!props.error ? '#EE5050' : 'inherit')};
  display: ${(props: IInfoProps) => (!!props.isHidden ? 'none' : 'inherit')};
`;

/**
 * @description wraps the buttons on the bottom and uses flex to space them out accordingly
 */
export const PopupButtonWrapper = styled.div`
  display: flex;
  position: static;
  bottom: 15px;
  left: 0px;
  right: 0px;
  width: 85%;
  margin: auto;
  & > button {
    flex: 1;
    margin-left: 5px;
    margin-right: 5px;
  }
`;

export const PopupDialogTabWrapper = styled.div`
  width: 100%;
  height: -fit-content;
  display: flex;
  flex-direction: column;
`;

export const PopupDialogTabHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  height: 40px;
  & > div {
    max-width: 33%;
  }
`;

interface IPopupDialogTabPage {
  background?: string;
}

export const PopupDialogTabPage = styled.div`
  padding: 5px;
  flex: 1;
  height: min-content;
  border-radius: 10px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
  background: ${(props: IPopupDialogTabPage): ThemeSet | string =>
    props.background
      ? props.background
      : popupTabViewBackgroundColor
      ? popupTabViewBackgroundColor
      : '#e1e1e1'};
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  z-index: 3;
`;

interface IPopupDialogTab {
  backgroundSelected?: string;
  background?: string;
  selected: boolean;
}

export const PopupDialogTab = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: min-content;
  padding: 5px;
  font-size: 1.1em;
  
  /* transition: all 0.15s ease-in-out; */
  z-index: ${(props: IPopupDialogTab): number => (props.selected ? 3 : 2)};
  /* ${(props: IPopupDialogTab): string =>
    props.selected
      ? 'font-weight: bold; box-shadow: 2px 2px 4px rgba(0,0,0,0.15)'
      : ''}; */
  background: ${(props: IPopupDialogTab): ThemeSet | string =>
    props.selected ? popupTabViewBackgroundColor : popupBackgroundColor};
  color: ${(props: IPopupDialogTab): string =>
    props.selected ? 'inherit' : '#aaa'};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  box-shadow: ${(props: IPopupDialogTab): string => props.selected ? '2.3px -2.3px 5px rgba(0,0,0,0.15)' : '0px'};

  &:hover {
    cursor: ${(props: IPopupDialogTab): string =>
      props.selected ? 'unset' : 'pointer'};
    ${(props: IPopupDialogTab): string =>
      props.selected ? '' : 'color: #666;'}
  }
`;
