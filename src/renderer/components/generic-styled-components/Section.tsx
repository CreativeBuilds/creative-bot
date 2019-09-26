import * as React from 'react';
import styled from 'styled-components';

import { seperatorColor } from '@/renderer/helpers/appearance';

/**
 * @description A Container for Content called Section
 */
export const Section = styled.div`
    padding: 10px;
    border-bottom: 1px solid ${seperatorColor ? seperatorColor : '#c1c1c1'};
`;

/**
 * @description A Container for Content called Section
 */
export const SectionTitle = styled.h3`
    margin: 0px;
    font-weight: normal;
`;