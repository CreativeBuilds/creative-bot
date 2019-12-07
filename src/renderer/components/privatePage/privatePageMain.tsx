import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  PageMain,
  PageTitle,
  PageContent,
  PageTitleRight
} from '../generic-styled-components/Page';

import styled from 'styled-components';
import { Tracking } from '../tracking/tracking';
import { firestore, firebase } from '@/renderer/helpers/firebase';
import { rxUser } from '@/renderer/helpers/rxUser';
import { Loading } from '../generic-styled-components/loading';
import { useIsPremium } from '@/renderer/helpers/useIsPremium';
import { RestrictedPopup } from './restrictedPopup';

const AppearanceWrapper = styled.div`
  height: 140px;
  text-align: center;
`;

const Center = styled.div`
  flex: 1;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface IProps {
  children: React.ReactNode;
}

/**
 * @description displays the Themes page
 */
export const PrivatePageMain = (props: IProps): React.ReactElement => {
  const hasAccess = useIsPremium();
  console.log('hasAccess', hasAccess);

  return (
    <PageMain>
      {hasAccess === 0 ? (
        <Center>
          <Loading />
        </Center>
      ) : hasAccess === 2 ? (
        props.children
      ) : (
        <RestrictedPopup />
      )}
    </PageMain>
  );
};
