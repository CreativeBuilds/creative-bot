import * as React from 'react';
import styled from 'styled-components';
import { ThemeSet } from 'styled-theming';
import { 
  backgroundPrimaryColor, 
  backgroundSecondaryColor,
  backgroundGradientDeg
} from '@/renderer/helpers/appearance';

interface IBackgroundProps {
  primaryColor?: string;
  secondaryColor?: string;
  deg?: string;
}

/**
 * @description background for the app
 */
export const Background = styled.div`
  background: linear-gradient(
    ${(props: IBackgroundProps): ThemeSet | string => 
      props.deg ? props.deg : 
        backgroundGradientDeg ? backgroundGradientDeg : '45deg'}, 
    ${(props: IBackgroundProps): ThemeSet | string => 
      props.primaryColor ? props.primaryColor :
        backgroundPrimaryColor ? backgroundPrimaryColor: '#383ee1'}, 
    ${(props: IBackgroundProps): ThemeSet | string => 
        props.secondaryColor ? props.secondaryColor : 
          backgroundSecondaryColor ? backgroundSecondaryColor : '#df1ebf'});
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;
