import * as React from 'react';
import styled from 'styled-components';

import { ThemeThumbnail } from './ThemeThumbnail'

interface IAppearanceItemProps {
    id: number;
    title: string;
    selected?: boolean;
    accent?: string;
    secondaryAccent?: string;
    textColor?: string;
    sideBarBackgroundColor?: string;
    contentViewBackgroundColor?: string;
    primaryBackgroundColor?: string;
    secondaryBackgroundColor?: string;
}

interface IThumbnailContainerProps {
    isSelected: Boolean;
}

/**
 * @description Renders a Title for AppearanceItem
 */
const AppearanceItemTitle = styled.h4`
    margin: 0;
    margin-bottom: 5px;
    font-weight: normal;
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

    > div:not(:last-child) {
        margin-right: 15px;
    }
`;

/**
 * @description Displays an AppearanceItem which contains a ThemeThumbnail component in AppearanceSelector
 */
export const AppearanceItem = ({id, title, selected, accent, secondaryAccent, textColor, sideBarBackgroundColor, contentViewBackgroundColor, primaryBackgroundColor, secondaryBackgroundColor}: IAppearanceItemProps): React.ReactElement => {
    
    const [isSelected, setSelected] =  React.useState<boolean>(Boolean(selected));
    const [index, setIndex] = React.useState(id);

    const onSelected = () => {
        setSelected(!isSelected);
    };
    
    return(
        <div>
            <AppearanceItemTitle>{title}</AppearanceItemTitle>
            <ThumbnailContainer isSelected={isSelected} onClick={onSelected}>
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
export const AppearanceSelector = (props: any, startIndex?: Number) => {

    const [index, setIndex] =  React.useState(startIndex != null ? startIndex : 0);

    const testFunc = () => {
        console.log('This a Test Homie');
    }

    return(
        <SelectorContainer>
            {
                React.Children.toArray(props.children).map(function(element, idx) {
                    return React.cloneElement(element, { onClick: testFunc() });
                })
            }
        </SelectorContainer>
    );
};