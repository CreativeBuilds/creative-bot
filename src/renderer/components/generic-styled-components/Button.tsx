import * as React from 'react';
import styled from 'styled-components';

interface IButton {
  inverted?: boolean;
  color?: string;
  disabled?: boolean;
  width?: string;
}

/**
 * @description Generic button use case for pretty much everything
 */
export const Button = styled.button`
  width: ${(props: IButton) => (props.width ? props.width : '100%')};
  padding: 8px;
  /** Swaps the background based on if its disabled inverted or has a color prop in that descending order
  disabled -> inverted -> color */
  background: ${(props: IButton) =>
    props.disabled
      ? '#d1d1d1'
      : props.inverted
      ? '#f1f1f1'
      : props.color
      ? props.color
      : '#df1ebf'};
  border: 0px;
  border-radius: 10px;
  /** Disabled box-shadow on disabled */
  box-shadow: ${props =>
    props.disabled ? '0px 0px 0px rgba(0,0,0,0)' : '2px 2px 4px #df1ebf44'};
  /** Makes color light gray on disbaled */
  color: ${props =>
    props.disabled ? '#e1e1e1' : props.inverted ? '#000000' : '#f1f1f1'};
  transition: 0.15s ease-in-out;
  font-weight: 400;
  font-size: 1.05em;
  &:hover {
    /** Changes cursor from pointer to regular if disabled (makes user think they cant click) */
    cursor: ${props => (props.disabled ? 'unset' : 'pointer')};
    box-shadow: ${props =>
      props.disabled ? '0px 0px 0px rgba(0,0,0,0)' : '2px 2px 4px #df1ebf88'};
  }
  outline: none !important;
  &:active {
    outline: none !important;
  }
  user-select: none;
`;
