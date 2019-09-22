import * as React from 'react';
import {
  PageMain,
  PageTitle,
  PageContent,
  PageTitleRight
} from '../generic-styled-components/Page';
import { Icon } from '../generic-styled-components/Icon';
import { 
    Section,
    SectionTitle
 } from '../generic-styled-components/Section';

import { ThemeThumbnail } from './ThemeThumbnail';
import { 
    AppearanceSelector, 
    AppearanceItem
} from './AppearanceSelector';

import { getPhrase } from '@/renderer/helpers/lang';

import { reverse } from 'lodash';
import styled from 'styled-components';
import { getSelf } from '@/renderer/helpers/dlive/getSelf';
import { shell } from 'electron';
import { IConfig, IMe, IChatObject, IOption } from '@/renderer';

/**
 * @description displays the Themes page
 */
export const Themes = (): React.ReactElement => {
    return(
        <PageMain>
            <PageTitle>
                {'Themes'}{''}
            </PageTitle>
            <PageContent>
                <Section>
                    <SectionTitle>Appearance</SectionTitle>
                    <div style={{ height: '140px', textAlign: 'center' }}>
                        <AppearanceSelector>
                            <AppearanceItem id={0} title={'Light'}/>
                            <AppearanceItem id={1} title={'Dark'} textColor={'#b1b1b1'} sideBarBackgroundColor={'#242424'} contentViewBackgroundColor={'#242424'}/>
                            <AppearanceItem id={2} title={'Light+'} textColor={'#242424'} sideBarBackgroundColor={'#d9d9d9'} contentViewBackgroundColor={'#d9d9d9'}/>
                            <AppearanceItem id={3} title={'Dark+'} textColor={'#a1a1a1'} sideBarBackgroundColor={'#323232'} contentViewBackgroundColor={'#323232'}/>
                        </AppearanceSelector>
                    </div>
                </Section>
            </PageContent>
        </PageMain>
    );
}