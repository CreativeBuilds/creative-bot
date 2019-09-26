import theme from 'styled-theming';
import { themeData } from './rxTheme';

export const accentColor = theme('mode', {
    light: themeData.appearances.light.accent.backgroundColor,
    dark: themeData.appearances.dark.accent.backgroundColor
});

export const accentHoverColor = theme('mode', {
    light: themeData.appearances.light.accent.hoverColor,
    dark: themeData.appearances.dark.accent.hoverColor
});

export const accentTextColor = theme('mode', {
    light: themeData.appearances.light.accent.color,
    dark: themeData.appearances.dark.accent.color
});

export const secondaryAccentColor = theme('mode', {
    light: themeData.appearances.light.secondaryAccent.backgroundColor,
    dark: themeData.appearances.dark.secondaryAccent.backgroundColor
});

export const secondaryAccentHoverColor = theme('mode', {
    light: themeData.appearances.light.secondaryAccent.hoverColor,
    dark: themeData.appearances.dark.secondaryAccent.hoverColor
});

export const secondaryAccentTextColor = theme('mode', {
    light: themeData.appearances.light.secondaryAccent.color,
    dark: themeData.appearances.dark.secondaryAccent.color
});

export const alternativeAccentColor = theme('mode', {
    light: themeData.appearances.light.alternativeAccent.backgroundColor,
    dark: themeData.appearances.dark.alternativeAccent.backgroundColor
});

export const alternativeAccentHoverColor = theme('mode', {
    light: themeData.appearances.light.alternativeAccent.hoverColor,
    dark: themeData.appearances.dark.alternativeAccent.hoverColor
});

export const alternativeAccentTextColor = theme('mode', {
    light: themeData.appearances.light.alternativeAccent.color,
    dark: themeData.appearances.dark.alternativeAccent.color
});

export const backgroundPrimaryColor = theme('mode', {
    light: themeData.appearances.light.background.primaryColor, 
    dark: themeData.appearances.dark.background.primaryColor, 
});

export const backgroundSecondaryColor = theme('mode', {
    light: themeData.appearances.light.background.secondaryColor,
    dark: themeData.appearances.dark.background.secondaryColor,
});

export const sideBarBackgroundColor = theme('mode', {
    light: themeData.appearances.light.sideBar.backgroundColor,
    dark: themeData.appearances.dark.sideBar.backgroundColor
});

export const sideBarHoverColor = theme('mode', {
    light: themeData.appearances.light.sideBar.hoverColor,
    dark: themeData.appearances.dark.sideBar.hoverColor
});

export const contentViewBackgroundColor = theme('mode', {
    light: themeData.appearances.light.contentView.backgroundColor,
    dark: themeData.appearances.dark.contentView.backgroundColor
});

export const titleBarTextColor = theme('mode', {
    light: themeData.appearances.light.titleBar.color,
    dark: themeData.appearances.dark.titleBar.color
});

export const titleBarBackgroundColor = theme('mode', {
    light: themeData.appearances.light.titleBar.backgroundColor,
    dark: themeData.appearances.dark.titleBar.backgroundColor
});

export const titleBarHoverColor = theme('mode', {
    light: themeData.appearances.light.titleBar.hoverColor,
    dark: themeData.appearances.dark.titleBar.hoverColor
});

export const titleColor = theme('mode', {
    light: themeData.appearances.light.title.color,
    dark: themeData.appearances.dark.title.color
});

export const textColor = theme('mode', {
    light: themeData.appearances.light.text.color,
    dark: themeData.appearances.dark.text.color
});

export const listItemColor = theme('mode', {
    light: themeData.appearances.light.listItem.color,
    dark: themeData.appearances.dark.listItem.color
});

export const listItemBorderColor = theme('mode', {
    light: themeData.appearances.light.listItem.borderColor,
    dark: themeData.appearances.dark.listItem.borderColor
});

export const listItemBackgroundColor = theme('mode', {
    light: themeData.appearances.light.listItem.backgroundColor,
    dark: themeData.appearances.dark.listItem.backgroundColor
});

export const listItemAlternativeColor = theme('mode', {
    light: themeData.appearances.light.listItem.alternativeColor,
    dark: themeData.appearances.dark.listItem.alternativeColor
});

export const textInputColor = theme('mode', {
    light: themeData.appearances.light.textInput.color,
    dark: themeData.appearances.dark.textInput.color
});

export const textInputPlaceholderColor = theme('mode', {
    light: themeData.appearances.light.textInput.placeholderColor,
    dark: themeData.appearances.dark.textInput.placeholderColor
});

export const textInputBackgroundColor = theme('mode', {
    light: themeData.appearances.light.textInput.backgroundColor,
    dark: themeData.appearances.dark.textInput.backgroundColor
});

export const popupTextColor = theme('mode', {
    light: themeData.appearances.light.popup.color,
    dark: themeData.appearances.dark.popup.color
});

export const popupBackgroundColor = theme('mode', {
    light: themeData.appearances.light.popup.backgroundColor,
    dark: themeData.appearances.dark.popup.backgroundColor
});

export const popupTabViewColor = theme('mode', {
    light: themeData.appearances.light.popupTabView.color,
    dark: themeData.appearances.dark.popupTabView.color
});

export const popupTabViewBackgroundColor = theme('mode', {
    light: themeData.appearances.light.popupTabView.backgroundColor,
    dark: themeData.appearances.dark.popupTabView.backgroundColor
});

export const popupButtonColor = theme('mode', {
    light: themeData.appearances.light.popupButton.color,
    dark: themeData.appearances.dark.popupButton.color
});

export const popupButtonBackgroundColor = theme('mode', {
    light: themeData.appearances.light.popupButton.backgroundColor,
    dark: themeData.appearances.dark.popupButton.backgroundColor
});

export const popupButtonDisabledBackgroundColor = theme('mode', {
    light: themeData.appearances.light.popupButton.disabledBackgroundColor,
    dark: themeData.appearances.dark.popupButton.disabledBackgroundColor
});

export const popupButtonDisabledColor = theme('mode', {
    light: themeData.appearances.light.popupButton.disabledColor,
    dark: themeData.appearances.dark.popupButton.disabledColor
});

export const dropDownBoxColor = theme('mode', {
    light: themeData.appearances.light.dropDownBox.color,
    dark: themeData.appearances.dark.dropDownBox.color
});

export const dropDownBoxBorderColor = theme('mode', {
    light: themeData.appearances.light.dropDownBox.borderColor,
    dark: themeData.appearances.dark.dropDownBox.borderColor
});

export const dropDownBoxBackgroundColor = theme('mode', {
    light: themeData.appearances.light.dropDownBox.backgroundColor,
    dark: themeData.appearances.dark.dropDownBox.backgroundColor
});

export const dropDownBoxHoverColor = theme('mode', {
    light: themeData.appearances.light.dropDownBox.hoverColor,
    dark: themeData.appearances.dark.dropDownBox.hoverColor
});

export const dropDownBoxSelectedColor = theme('mode', {
    light: themeData.appearances.light.dropDownBox.selectedColor,
    dark: themeData.appearances.dark.dropDownBox.selectedColor
});

export const seperatorColor = theme('mode', {
    light: themeData.appearances.light.seperator.color,
    dark: themeData.appearances.dark.seperator.color
});