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
import { PrivatePageMain } from '../privatePage/privatePageMain';

const AppearanceWrapper = styled.div`
  height: 140px;
  text-align: center;
`;

/**
 * @description displays the Themes page
 */
export const Testing = (): React.ReactElement => {
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState('Loading');

  useEffect(() => {
    console.log('Getting data');
    const listener = firestore
      .collection('testing')
      .get()
      .then(collection => {
        console.log('collection', collection);
        collection.forEach(item => {
          console.log('item', item.data());
          setName(item.data()?.name as string);
        });
      })
      .catch(err => {
        console.log('GOT ERROR');
        console.warn(err);
      });
  }, []);

  useEffect(() => {
    firebase
      .auth()
      .currentUser?.getIdTokenResult()
      .then(idTokenResult => {
        console.log(idTokenResult.claims, 'claims');
      });
  }, []);

  return (
    <PrivatePageMain>
      <Tracking path='/testing' />
      <PageTitle>Testing</PageTitle>
      <PageContent>Some content here</PageContent>
    </PrivatePageMain>
  );
};
