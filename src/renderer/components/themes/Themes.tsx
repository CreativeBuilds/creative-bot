import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  PageMain,
  PageTitle,
  PageContent,
  PageTitleRight
} from '../generic-styled-components/Page';
import { Section, SectionTitle } from '../generic-styled-components/Section';

import { AppearanceSelector, AppearanceItem } from './AppearanceSelector';

import { useTheme } from '../themeContext';

import { themeData } from '@/renderer/helpers/rxTheme';

import { getPhrase } from '@/renderer/helpers/lang';

import styled from 'styled-components';

const AppearanceWrapper = styled.div`
  height: 140px;
  text-align: center;
`;

/**
 * @description displays the Themes page
 */
export const Themes = (): React.ReactElement => {
  return (
    <PageMain>
      <PageTitle>
        {getPhrase('themes_name')}
        {''}
      </PageTitle>
      <PageContent>
        <Section>
          <SectionTitle>{getPhrase('section_appearance')}</SectionTitle>
          <AppearanceWrapper>
            <AppearanceSelector>
              <AppearanceItem
                title={getPhrase('appearance_light_name')}
                accent={themeData.appearances.light.accent.backgroundColor}
                secondaryAccent={
                  themeData.appearances.light.secondaryAccent.backgroundColor
                }
                textColor={themeData.appearances.light.text.color}
                sideBarBackgroundColor={
                  themeData.appearances.light.sideBar.backgroundColor
                }
                contentViewBackgroundColor={
                  themeData.appearances.light.contentView.backgroundColor
                }
                primaryBackgroundColor={
                  themeData.appearances.light.background.primaryColor
                }
                secondaryBackgroundColor={
                  themeData.appearances.light.background.secondaryColor
                }
              />
              <AppearanceItem
                title={getPhrase('appearance_dark_name')}
                accent={themeData.appearances.dark.accent.backgroundColor}
                secondaryAccent={
                  themeData.appearances.dark.secondaryAccent.backgroundColor
                }
                textColor={themeData.appearances.dark.text.color}
                sideBarBackgroundColor={
                  themeData.appearances.dark.sideBar.backgroundColor
                }
                contentViewBackgroundColor={
                  themeData.appearances.dark.contentView.backgroundColor
                }
                primaryBackgroundColor={
                  themeData.appearances.dark.background.primaryColor
                }
                secondaryBackgroundColor={
                  themeData.appearances.dark.background.secondaryColor
                }
              />
            </AppearanceSelector>
          </AppearanceWrapper>
        </Section>
      </PageContent>
    </PageMain>
  );
};
