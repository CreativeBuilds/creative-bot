import theme from 'styled-theming';
import { themeData } from './rxTheme';

/**
 * @description Appearances Accent Color (Primary Use for Buttons and Hyperlinks)
 */
export const accentColor = theme('mode', {
    light: themeData.appearances.light.accent.backgroundColor,
    dark: themeData.appearances.dark.accent.backgroundColor
});

/**
 * @description Appearances Accent Hover Color (Primary Use for Buttons and Hyperlinks when mouse is hovering over the Element)
 */
export const accentHoverColor = theme('mode', {
    light: themeData.appearances.light.accent.hoverColor,
    dark: themeData.appearances.dark.accent.hoverColor
});

/**
 * @description Appearances Accent Text Color for Text that would be over or on an Element that has Accent Color Applied to it
 */
export const accentTextColor = theme('mode', {
    light: themeData.appearances.light.accent.color,
    dark: themeData.appearances.dark.accent.color
});

/**
 * @description Appearances Secondary Accent Color (Primary Use for Buttons and Hyperlinks)
 */
export const secondaryAccentColor = theme('mode', {
    light: themeData.appearances.light.secondaryAccent.backgroundColor,
    dark: themeData.appearances.dark.secondaryAccent.backgroundColor
});

/**
 * @description Appearances Secondary Accent Hover Color (Primary Use for Buttons and Hyperlinks when mouse is hovering over the Element)
 */
export const secondaryAccentHoverColor = theme('mode', {
    light: themeData.appearances.light.secondaryAccent.hoverColor,
    dark: themeData.appearances.dark.secondaryAccent.hoverColor
});

/**
 * @description Appearances Secondary Accent Text Color for Text that would be over or on an Element that has Accent Color Applied to it
 */
export const secondaryAccentTextColor = theme('mode', {
    light: themeData.appearances.light.secondaryAccent.color,
    dark: themeData.appearances.dark.secondaryAccent.color
});

/**
 * @description Appearances Alternative Accent Color (Primary Use for Buttons and Hyperlinks)
 */
export const alternativeAccentColor = theme('mode', {
    light: themeData.appearances.light.alternativeAccent.backgroundColor,
    dark: themeData.appearances.dark.alternativeAccent.backgroundColor
});

/**
 * @description Appearances Alternative Accent Hover Color (Primary Use for Buttons and Hyperlinks when mouse is hovering over the Element)
 */
export const alternativeAccentHoverColor = theme('mode', {
    light: themeData.appearances.light.alternativeAccent.hoverColor,
    dark: themeData.appearances.dark.alternativeAccent.hoverColor
});

/**
 * @description Appearances Alternative Accent Text Color for Text that would be over or on an Element that has Accent Color Applied to it
 */
export const alternativeAccentTextColor = theme('mode', {
    light: themeData.appearances.light.alternativeAccent.color,
    dark: themeData.appearances.dark.alternativeAccent.color
});

/**
 * @description Appearances Primary Background Color
 */
export const backgroundPrimaryColor = theme('mode', {
    light: themeData.appearances.light.background.primaryColor, 
    dark: themeData.appearances.dark.background.primaryColor, 
});

/**
 * @description Appearances Secondary Background Color
 */
export const backgroundSecondaryColor = theme('mode', {
    light: themeData.appearances.light.background.secondaryColor,
    dark: themeData.appearances.dark.background.secondaryColor,
});

/**
 * @description Appearances Background Gradiend Degree Value
 */
export const backgroundGradientDeg = theme('mode', {
    light: themeData.appearances.light.background.deg,
    dark: themeData.appearances.dark.background.deg,
});

/**
 * @description Appearances SideBar (NavBar) Background Color
 */
export const sideBarBackgroundColor = theme('mode', {
    light: themeData.appearances.light.sideBar.backgroundColor,
    dark: themeData.appearances.dark.sideBar.backgroundColor
});

/**
 * @description Appearances SideBar (NavBar) Hover Color
 */
export const sideBarHoverColor = theme('mode', {
    light: themeData.appearances.light.sideBar.hoverColor,
    dark: themeData.appearances.dark.sideBar.hoverColor
});

/**
 * @description Appearances ContentView (Page) Background Color
 */
export const contentViewBackgroundColor = theme('mode', {
    light: themeData.appearances.light.contentView.backgroundColor,
    dark: themeData.appearances.dark.contentView.backgroundColor
});

/**
 * @description Appearances Page TitleBar Text Color
 */
export const titleBarTextColor = theme('mode', {
    light: themeData.appearances.light.titleBar.color,
    dark: themeData.appearances.dark.titleBar.color
});

/**
 * @description Appearances Page TitleBar Background Color
 */
export const titleBarBackgroundColor = theme('mode', {
    light: themeData.appearances.light.titleBar.backgroundColor,
    dark: themeData.appearances.dark.titleBar.backgroundColor
});

/**
 * @description Appearances Page TitleBar Hover Color
 */
export const titleBarHoverColor = theme('mode', {
    light: themeData.appearances.light.titleBar.hoverColor,
    dark: themeData.appearances.dark.titleBar.hoverColor
});

/**
 * @description Appearances Title Text Color
 */
export const titleColor = theme('mode', {
    light: themeData.appearances.light.title.color,
    dark: themeData.appearances.dark.title.color
});

/**
 * @description Appearances Text Color
 */
export const textColor = theme('mode', {
    light: themeData.appearances.light.text.color,
    dark: themeData.appearances.dark.text.color
});

/**
 * @description Appearances Text Color of a ListItem
 */
export const listItemColor = theme('mode', {
    light: themeData.appearances.light.listItem.color,
    dark: themeData.appearances.dark.listItem.color
});

/**
 * @description Appearances Border Color of a ListItem
 */
export const listItemBorderColor = theme('mode', {
    light: themeData.appearances.light.listItem.borderColor,
    dark: themeData.appearances.dark.listItem.borderColor
});

/**
 * @description Appearances Default Color of a ListItem
 */
export const listItemBackgroundColor = theme('mode', {
    light: themeData.appearances.light.listItem.backgroundColor,
    dark: themeData.appearances.dark.listItem.backgroundColor
});

/**
 * @description Appearances Alternative Color of a ListItem
 */
export const listItemAlternativeColor = theme('mode', {
    light: themeData.appearances.light.listItem.alternativeColor,
    dark: themeData.appearances.dark.listItem.alternativeColor
});

/**
 * @description Appearances Text Input Text Color
 */
export const textInputColor = theme('mode', {
    light: themeData.appearances.light.textInput.color,
    dark: themeData.appearances.dark.textInput.color
});

/**
 * @description Appearances Text Input Placeholder Text Color
 */
export const textInputPlaceholderColor = theme('mode', {
    light: themeData.appearances.light.textInput.placeholderColor,
    dark: themeData.appearances.dark.textInput.placeholderColor
});

/**
 * @description Appearances Text Input Background Color
 */
export const textInputBackgroundColor = theme('mode', {
    light: themeData.appearances.light.textInput.backgroundColor,
    dark: themeData.appearances.dark.textInput.backgroundColor
});

/**
 * @description Appearances Text Input Disanbled Text Color
 */
export const textInputDisabledTextColor = theme('mode', {
    light: themeData.appearances.light.textInput.disabledTextColor,
    dark: themeData.appearances.dark.textInput.disabledTextColor
});

/**
 * @description Appearances Popup Text Color
 */
export const popupTextColor = theme('mode', {
    light: themeData.appearances.light.popup.color,
    dark: themeData.appearances.dark.popup.color
});

/**
 * @description Appearances Popup Background Color
 */
export const popupBackgroundColor = theme('mode', {
    light: themeData.appearances.light.popup.backgroundColor,
    dark: themeData.appearances.dark.popup.backgroundColor
});

/**
 * @description Appearances Popup TabView Text Color
 */
export const popupTabViewColor = theme('mode', {
    light: themeData.appearances.light.popupTabView.color,
    dark: themeData.appearances.dark.popupTabView.color
});

/**
 * @description Appearances Popup TabView Background Color
 */
export const popupTabViewBackgroundColor = theme('mode', {
    light: themeData.appearances.light.popupTabView.backgroundColor,
    dark: themeData.appearances.dark.popupTabView.backgroundColor
});

/**
 * @description Appearances Popup TabView Background Color
 */
export const popupTabViewSecondaryBackgroundColor = theme('mode', {
    light: themeData.appearances.light.popupTabView.secondaryBackgroundColor,
    dark: themeData.appearances.dark.popupTabView.secondaryBackgroundColor
});

/**
 * @description Appearances Popup Button Text Color
 */
export const popupButtonColor = theme('mode', {
    light: themeData.appearances.light.popupButton.color,
    dark: themeData.appearances.dark.popupButton.color
});

/**
 * @description Appearances Popup Button Background Color
 */
export const popupButtonBackgroundColor = theme('mode', {
    light: themeData.appearances.light.popupButton.backgroundColor,
    dark: themeData.appearances.dark.popupButton.backgroundColor
});

/**
 * @description Appearances Popup Button Inverted Background Color
 */
export const popupButtonInvertedBackgroundColor = theme('mode', {
    light: themeData.appearances.light.popupButton.invertedBackgroundColor,
    dark: themeData.appearances.dark.popupButton.invertedBackgroundColor
});

/**
 * @description Appearances Popup Button Destructive Background Color
 */
export const popupButtonDestructiveBackgroundColor = theme('mode', {
    light: themeData.appearances.light.popupButton.destructivebackgroundColor,
    dark: themeData.appearances.dark.popupButton.destructivebackgroundColor
});

/**
 * @description Appearances Popup Button Destructive Text Color
 */
export const popupButtonDestructiveColor = theme('mode', {
    light: themeData.appearances.light.popupButton.destructiveColor,
    dark: themeData.appearances.dark.popupButton.destructiveColor
});

/**
 * @description Appearances Popup Button Disabled Background Color
 */
export const popupButtonDisabledBackgroundColor = theme('mode', {
    light: themeData.appearances.light.popupButton.disabledBackgroundColor,
    dark: themeData.appearances.dark.popupButton.disabledBackgroundColor
});

/**
 * @description Appearances Popup Button Disabled Text Color
 */
export const popupButtonDisabledColor = theme('mode', {
    light: themeData.appearances.light.popupButton.disabledColor,
    dark: themeData.appearances.dark.popupButton.disabledColor
});

/**
 * @description Appearances DropDownBox Text Color
 */
export const dropDownBoxColor = theme('mode', {
    light: themeData.appearances.light.dropDownBox.color,
    dark: themeData.appearances.dark.dropDownBox.color
});

/**
 * @description Appearances DropDownBox Border Color
 */
export const dropDownBoxBorderColor = theme('mode', {
    light: themeData.appearances.light.dropDownBox.borderColor,
    dark: themeData.appearances.dark.dropDownBox.borderColor
});

/**
 * @description Appearances DropDownBox Background Color
 */
export const dropDownBoxBackgroundColor = theme('mode', {
    light: themeData.appearances.light.dropDownBox.backgroundColor,
    dark: themeData.appearances.dark.dropDownBox.backgroundColor
});

/**
 * @description Appearances DropDownBox Hover Color
 */
export const dropDownBoxHoverColor = theme('mode', {
    light: themeData.appearances.light.dropDownBox.hoverColor,
    dark: themeData.appearances.dark.dropDownBox.hoverColor
});

/**
 * @description Appearances DropDownBox Selected Color
 */
export const dropDownBoxSelectedColor = theme('mode', {
    light: themeData.appearances.light.dropDownBox.selectedColor,
    dark: themeData.appearances.dark.dropDownBox.selectedColor
});

/**
 * @description Appearances Seperator Color
 */
export const seperatorColor = theme('mode', {
    light: themeData.appearances.light.seperator.color,
    dark: themeData.appearances.dark.seperator.color
});

/**
 * @description Appearances Selector Color
 */
export const selectorColor = theme('mode', {
    light: themeData.appearances.light.selector.color,
    dark: themeData.appearances.dark.selector.color
});