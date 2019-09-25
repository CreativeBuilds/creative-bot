import theme from 'styled-theming';
import { themeData } from './rxTheme';

export const backgroundColor = theme('mode', {
    light:[
        themeData.appearances.light.background.primaryColor, 
        themeData.appearances.light.background.secondaryColor
    ],
    dark: [
        themeData.appearances.dark.background.primaryColor, 
        themeData.appearances.dark.background.secondaryColor
    ],
});

export const sideBarBackgroundColor = theme('mode', {
    light: themeData.appearances.light.sideBar.backgroundColor,
    dark: themeData.appearances.dark.sideBar.backgroundColor
});

export const contentViewBackgroundColor = theme('mode', {
    light: themeData.appearances.light.contentView.backgroundColor,
    dark: themeData.appearances.dark.contentView.backgroundColor
});

export const titleBarBackgroundColor = theme('mode', {
    light: themeData.appearances.light.titleBar.backgroundColor,
    dark: themeData.appearances.dark.titleBar.backgroundColor
});

export const titleColor = theme('mode', {
    light: themeData.appearances.light.title.color,
    dark: themeData.appearances.dark.title.color
});

export const textColor = theme('mode', {
    light: themeData.appearances.light.text.color,
    dark: themeData.appearances.dark.text.color
});