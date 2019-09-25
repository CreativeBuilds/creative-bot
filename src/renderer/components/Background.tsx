import * as React from 'react';
import styled from 'styled-components';
import { backgroundPrimaryColor, backgroundSecondaryColor} from '@/renderer/helpers/appearance';

/**
 * @description background for the app
 */
export const Background = styled.div`
  background: linear-gradient(45deg, ${backgroundPrimaryColor ? backgroundPrimaryColor: '#383ee1'}, ${ backgroundSecondaryColor ? backgroundSecondaryColor : '#df1ebf'});
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;
