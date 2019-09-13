import styled from 'styled-components';

interface IProps {
  width?: string;
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
      ${(props: IProps): string =>
        props.shadowHoverColor ? props.shadowHoverColor : '#922ccedd'};
  }
`;
