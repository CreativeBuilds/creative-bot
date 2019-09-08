import * as React from 'react';
import styled from 'styled-components';

interface IProps {
  disabled?: boolean;
  color?: string;
  colorHover?: string;
}

/**
 * @description wraps icon buttons
 */
export const Icon = styled.div`
  height: min-content;
  width: min-content;
  display: flex;
  justify-content: center;
  align-items: center;
  & > svg {
    color: ${(props: IProps): string =>
      props.disabled
        ? '#e1e1e1'
        : props.color
        ? `${props.color}dd`
        : '#922ccedd'};
  }
  &:hover {
    cursor: ${(props: IProps): string =>
      props.disabled ? 'unset' : 'pointer'};
    & > svg {
      color: ${(props: IProps): string =>
        props.disabled
          ? '#e1e1e1'
          : props.colorHover
          ? props.colorHover
          : props.color
          ? props.color
          : '#922cce'};
    }
  }
`;
