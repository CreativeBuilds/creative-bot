import * as React from 'react';
import { useState, useEffect } from 'react';
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

import { 
    AppearanceSelector, 
    AppearanceItem
} from './AppearanceSelector';

import { useTheme } from './../ThemeContext';

import { themeData } from '@/renderer/helpers/rxTheme';

import { getPhrase } from '@/renderer/helpers/lang';

import { rxConfig, updateConfig } from '@/renderer/helpers/rxConfig';

import { reverse } from 'lodash';
import styled from 'styled-components';
import { getSelf } from '@/renderer/helpers/dlive/getSelf';
import { shell } from 'electron';
import { IConfig, IMe, IChatObject, IOption } from '@/renderer';

interface IThemeProps {
    Config: Partial<IConfig>;
}

const AppearanceWrapper = styled.div`
    height: 140px;
    text-align: center;
`;

/**
 * @description displays the Themes page
 */
export const Themes = ({ Config }: IThemeProps) : React.ReactElement => {

    const themeToggle = useTheme();
    const [config, setConfig] = useState<Partial<IConfig>>(Config);
    const [themeState, setThemeState] = useState(themeToggle.appearance);

    /**
   * @description subscribes to config and makes sure that Appearance variable is upto date
   */
    useEffect(() => {
        const listener = rxConfig.subscribe((mConfig: IConfig) => {
            setConfig(mConfig);
            console.log(mConfig.appearance);
            setThemeState(mConfig.appearance)
        });

        return () => {
        listener.unsubscribe();
        };
    }, []);

    return(
        <PageMain>
            <PageTitle>
                {'Themes (Beta)'}{''}
            </PageTitle>
            <PageContent>
                <Section>
                    <SectionTitle>Appearance</SectionTitle>
                    <AppearanceWrapper>
                        <AppearanceSelector startIndex={ themeState === 'light' ? 0 : 1 }>
                        <AppearanceItem 
                                title={'Light'} 
                                accent={themeData.appearances.light.accent.backgroundColor}
                                secondaryAccent={themeData.appearances.light.secondaryAccent.backgroundColor}
                                textColor={themeData.appearances.light.text.color}
                                sideBarBackgroundColor={themeData.appearances.light.sideBar.backgroundColor} 
                                contentViewBackgroundColor={themeData.appearances.light.contentView.backgroundColor}
                                primaryBackgroundColor={themeData.appearances.light.background.primaryBackgroundColor}
                                secondaryBackgroundColor={themeData.appearances.light.background.secondaryBackgroundColor} />
                            <AppearanceItem 
                                title={'Dark'}
                                accent={themeData.appearances.dark.accent.backgroundColor}
                                secondaryAccent={themeData.appearances.dark.secondaryAccent.backgroundColor}
                                textColor={themeData.appearances.dark.text.color}
                                sideBarBackgroundColor={themeData.appearances.dark.sideBar.backgroundColor} 
                                contentViewBackgroundColor={themeData.appearances.dark.contentView.backgroundColor}
                                primaryBackgroundColor={themeData.appearances.dark.background.primaryBackgroundColor}
                                secondaryBackgroundColor={themeData.appearances.dark.background.secondaryBackgroundColor} />
                        </AppearanceSelector>
                    </AppearanceWrapper>
                </Section>
            </PageContent>
        </PageMain>
    );
}