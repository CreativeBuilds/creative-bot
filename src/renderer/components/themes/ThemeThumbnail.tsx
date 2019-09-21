import * as React from 'react';
import styled from 'styled-components';

interface IBackgroundProps {
    primaryColor?: string;
    secondaryColor?: string;    
}

interface IProps {
    Color?: string;
}

interface IThemeThumbnailProps {
    accent?: string;
    secondaryAccent?: string;
    textColor?: string;
    sideBarBackgroundColor?: string;
    contentViewBackgroundColor?: string;
    primaryBackgroundColor?: string;
    secondaryBackgroundColor?: string;
}

/**
 * @description Renders a Thumbnail Background that represents a Theme or Appearance
 */
const ThemeThumbnailBackground = styled.div`
    border-radius: 5px;
    background: linear-gradient(45deg, 
        ${(props: IBackgroundProps): string =>
        props.primaryColor != null ? props.primaryColor : '#383ee1'}, 
        ${(props: IBackgroundProps): string =>
            props.secondaryColor != null ? props.secondaryColor : '#df1ebf'});
    height: 100%;
    width: 100%;
    box-shadow: 0px 0px 20px 1.5px #48484848;
`;

/**
 * @description Renders a Thumbnail Sidebar Background that represents a Theme or Appearance
 */
const ThemeThumbnailSideBarBackground = styled.div`
    background-color: ${(props: IProps): string =>
        props.Color != null ? props.Color : '#f1f1f1ff'};
    height: 100%;
    width: 20px;
    float: left;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    box-shadow: 5px 0px 6px -2px #484848;
`;

/**
 * @description Renders a Thumbnail ContentView Background that represents a Theme or Appearance
 */
const ThemeThumbnailContentViewBackground = styled.div`
    background-color: ${(props: IProps): string =>
        props.Color != null ? props.Color : '#f1f1f1ff'};
    height: calc(100% - 20px);
    width: calc(100% - 40px);
    vertical-align: middle;
    float: right;
    border-radius: 5px;
    margin: 10px;
    box-shadow: 0px 0px 10px 1.5px #484848;
`;

/**
 * @description Renders a Thumbnail ContentView Titlebar Background that represents a Theme or Appearance
 */
const ThemeThumbnailContentViewTitleBarBackground = styled.div`
    background-color: ${(props: IProps): string =>
        props.Color != null ? props.Color : '#f1f1f1'};
    height: 20px;
    width: 100%;
    box-shadow: 0px 3px 10px -3px #484848;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
`;

/**
 * @description Renders a Thumbnail Titlebar Title Background that represents a Theme or Appearance
 */
const ThemeThumbnailTitleBarTitleBackground = styled.div`
    background-color: ${(props: IProps): string =>
        props.Color != null ? props.Color : '#969696'};
    height: 7px;
    width: 30px;
    margin: 7px;
    float: left;
`;

/**
 * @description Renders a Thumbnail Titlebar Title Background that represents a Theme or Appearance
 */
const ThemeThumbnailTitleBarRightItemsBackground = styled.div`
    background-color: ${(props: IProps): string =>
        props.Color != null ? props.Color : '#922ccedd'};
    height: 7px;
    width: 7px;
    margin: 7px;
    float: right;
`;

/**
 * @description Renders a Thumbnail Sidebar Item that represents a Theme or Appearance
 */
const ThemeThumbnailSideBarItem = styled.div`
    margin: 7px;
    width: 6px;
    height: 6px;
    background-color: ${(props: IProps): string =>
        props.Color != null ? props.Color : '#922ccedd'};
    display: block;
`;

/**
 * @description displays / renders the Thumbnail that represents a Theme or Appearance
 */
export const ThemeThumbnail = ({accent, secondaryAccent, textColor, sideBarBackgroundColor, contentViewBackgroundColor, primaryBackgroundColor, secondaryBackgroundColor} : IThemeThumbnailProps): React.ReactElement => {

    return(
        <ThemeThumbnailBackground primaryColor={primaryBackgroundColor} secondaryColor={secondaryBackgroundColor}>
            <ThemeThumbnailSideBarBackground Color={sideBarBackgroundColor}>
                <ThemeThumbnailSideBarItem Color={secondaryAccent} />
                <ThemeThumbnailSideBarItem Color={secondaryAccent} />
                <ThemeThumbnailSideBarItem Color={secondaryAccent} />
                <ThemeThumbnailSideBarItem Color={secondaryAccent} />
            </ThemeThumbnailSideBarBackground>
            <ThemeThumbnailContentViewBackground Color={contentViewBackgroundColor}>
                <ThemeThumbnailContentViewTitleBarBackground Color={contentViewBackgroundColor}>
                    <ThemeThumbnailTitleBarTitleBackground Color={textColor} />
                    <ThemeThumbnailTitleBarRightItemsBackground Color={accent} />
                </ThemeThumbnailContentViewTitleBarBackground>
            </ThemeThumbnailContentViewBackground>
        </ThemeThumbnailBackground>
    )

}