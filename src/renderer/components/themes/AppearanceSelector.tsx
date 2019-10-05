import * as React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

import { rxConfig, updateConfig } from '@/renderer/helpers/rxConfig';

import { ThemeThumbnail } from './ThemeThumbnail'
import { useTheme } from './../ThemeContext';
import { IConfig } from '@/renderer';

interface IAppearanceItemProps {
    id?: number;
    title: string;
    selected?: boolean | undefined;
    onSelected?: Function | undefined;
    accent?: string;
    secondaryAccent?: string;
    textColor?: string;
    sideBarBackgroundColor?: string;
    contentViewBackgroundColor?: string;
    primaryBackgroundColor?: string;
    secondaryBackgroundColor?: string;
}

interface IAppearanceSelectorProps {
    startIndex?: number;
    startMode?: string;
}

interface IThumbnailContainerProps {
    isSelected: boolean | undefined;
}

/**
 * @description Renders a Title for AppearanceItem
 */
const AppearanceItemTitle = styled.div`
    margin: 0;
    margin-bottom: 5px;
    font-weight: normal;
    user-select: none;
`;

/**
 * @description Renders a Title for AppearanceItem
 */
const ThumbnailContainer = styled.div`
    padding: 0px;
    height: 90px;
    width: 150px;
    cursor: pointer;

    border-width: ${(props: IThumbnailContainerProps): string =>
            props.isSelected ? String('7px') : String('0px')};
    border-color: dodgerblue;
    border-style: solid;
    border-radius: 11px;
    box-sizing: border-box;
`;

/**
 * @description Renders a Title for AppearanceItem
 */
const SelectorContainer = styled.div`
    display: inline-flex;
    margin: 5px;
    text-align: center;

    > div:not(:last-child) {
        margin-right: 15px;
    }
`;

/**
 * @description Displays an AppearanceItem which contains a ThemeThumbnail component in AppearanceSelector
 */
export const AppearanceItem = ({id, title, selected, onSelected = function() {}, accent, secondaryAccent, textColor, sideBarBackgroundColor, contentViewBackgroundColor, primaryBackgroundColor, secondaryBackgroundColor}: IAppearanceItemProps): React.ReactElement => {
    
    return(
        <div>
            <AppearanceItemTitle>{title}</AppearanceItemTitle>
            <ThumbnailContainer isSelected={selected}
                onClick={() => { onSelected(); }}>
                <ThemeThumbnail 
                    accent={accent} 
                    secondaryAccent={secondaryAccent} 
                    textColor={textColor} 
                    sideBarBackgroundColor={sideBarBackgroundColor} 
                    contentViewBackgroundColor={contentViewBackgroundColor}
                    primaryBackgroundColor={primaryBackgroundColor}
                    secondaryBackgroundColor={secondaryBackgroundColor}/>
            </ThumbnailContainer>
        </div>
    );
};

/**
 * @description Component that Acts like a Group of Checkboxes for changing a Theme's Appearance
 */
export const AppearanceSelector = (props: any, {startIndex, startMode}: IAppearanceSelectorProps ) => {

    const [index, setIndex] =  React.useState(startIndex != null ? startIndex : startIndex ? startMode == 'light' ? 0 : 1 : 0);
    const themeToggle = useTheme();

    /**
   * @description subscribes to config and makes sure that Appearance variable is upto date
   */
    useEffect(() => {
        const listener = rxConfig.subscribe((mConfig: IConfig) => {
            setIndex(mConfig.appearance == 'light' ? 0 : 1);
        });

        return () => {
        listener.unsubscribe();
        };
    }, []);

    const isSelected = (idx: Number): boolean => {
        return index == idx ? true : false;
    };

    return(
        <SelectorContainer>
            {
                React.Children.toArray(props.children).map(function(element, idx) {
                    console.log(index);
                    return React.cloneElement(element, { id: idx, onSelected: function () {
                        setIndex(idx);
                        themeToggle.setTheme(idx == 0 ? 'light' : 'dark');
                        //console.log(element.props.title);
                        //console.log(theme(element.props.title.toLowerCase()));
                    },
                    selected: index == idx ? true : false });
                })
            }
        </SelectorContainer>
    );
};