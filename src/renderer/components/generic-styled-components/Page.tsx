import styled from 'styled-components';
import { contentViewBackgroundColor, titleColor, textColor } from '@/renderer/helpers/appearance'

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
  background: ${(props: IDivStyles) =>
    props.background ? props.background : contentViewBackgroundColor ? contentViewBackgroundColor : '#f1f1f1'};
  color: ${(props: IDivStyles) => (props.color ? props.color : textColor ? textColor : '#000')};
  display: flex;
  flex-direction: column;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
  position: relative;
`;

export const PageTitle = styled.div`
  font-size: 1.3em;
  font-weight: 100;
  text-align: left;
  width: -webkit-fill-available;
  padding: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  color: ${(props: IDivStyles) => (props.color ? props.color : titleColor ? titleColor : '#000')};
  display: flex;
  position: relative;
  max-height: 36px;
  min-height: 36px;
  height: 36px;
  overflow-y: hidden;
  align-items: center;
`;

export const PageTitleRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 10px;
  height: 100%;
`;

export const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  position: relative;
`;
