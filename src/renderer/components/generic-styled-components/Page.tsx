import styled from 'styled-components';

/**
 * @description all styled components used across pages will be found here
 */

interface IDivStyles {
  background?: string;
  color?: string;
}

/**
 * @description by default a white background for any page
 */
export const PageMain = styled.div`
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  /* padding: 10px; */
  border-radius: 10px;
  background: ${(props: IDivStyles): string =>
    props.background ? props.background : '#f1f1f1'};
  color: ${(props: IDivStyles): string => (props.color ? props.color : '#000')};
  display: flex;
  flex-direction: column;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
`;

export const PageTitle = styled.div`
  font-size: 1.3em;
  font-weight: 100;
  text-align: left;
  width: -webkit-fill-available;
  padding: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  display: flex;
`;

export const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  position: relative;
`;
