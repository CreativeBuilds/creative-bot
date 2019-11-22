import * as React from 'react';
import styled from 'styled-components';
import { ThemeSet } from 'styled-theming';

import {
    popupTabViewBackgroundColor,
  } from '@/renderer/helpers/appearance';

export const Panel = styled.div`
    background-color: ${popupTabViewBackgroundColor}
    padding: 10px; 
    border-radius: 10px;
    width: 100%;
    margin-bottom: 5px;
    box-sizing: border-box;
`;

export const PanelTitle = styled.h4`
    margin: 0;
    display: inline-block;
    user-select: none;
`;

export const PanelSubtitle = styled.h6`
    margin: 0;
    display: inline-block;
`;