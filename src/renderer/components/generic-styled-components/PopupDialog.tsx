import styled from 'styled-components';
import { fadeIn } from '../animations/fadeIn';

interface IPropsDialog {
  minWidth?: string;
  width?: string;
  minHeight?: string;
  height?: string;
}

/**
 * Generic white background popup dialog
 */
export const PopupDialog = styled.div`
  position: relative;
  background: #f1f1f1;
  min-width: ${(props: IPropsDialog) =>
    !!props.minWidth ? props.minWidth : '350px'};
  width: ${(props: IPropsDialog) => (!!props.width ? props.width : '350px')};
  min-height: ${(props: IPropsDialog) =>
    !!props.minHeight ? props.minHeight : '450px'};
  height: ${(props: IPropsDialog) =>
    !!props.height ? props.height : 'fit-content'};
  color: #000;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 10px;
  animation: ${fadeIn} 0.3s linear;
  animation-fill-mode: forwards;
`;

interface ITitleProps {
  center?: boolean;
}

export const PopupDialogTitle = styled.h1`
  max-width: 100%;
  font-size: 1.7em;
  font-weight: 100;
  margin: 0;
  margin-bottom: 20px;
  text-align: ${(props: ITitleProps) => (!!props.center ? 'center' : 'auto')};
`;

export const PopupDialogText = styled.div`
  width: 85%;
  font-size: 1.2em;
  font-weight: 100;
  margin: auto;
  text-align: ${(props: ITitleProps) => (!!props.center ? 'center' : 'unset')};
`;

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
`;

export const PopupDialogInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 85%;
  margin: auto;
  margin-bottom: 10px;
`;

export const PopupDialogInputName = styled.div`
  font-size: 1.1em;
  font-weight: 100;
`;

interface IInfoProps {
  error?: boolean;
  isHidden?: boolean;
}

export const PopupDialogInputInfo = styled.div`
  font-size: 1em;
  font-weight: 100;
  color: ${(props: IInfoProps) => (!!props.error ? '#EE5050' : 'inherit')};
  display: ${(props: IInfoProps) => (!!props.isHidden ? 'none' : 'inherit')};
`;