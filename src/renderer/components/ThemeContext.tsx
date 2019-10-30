import * as React from 'react';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { rxConfig, updateConfig } from '../helpers/rxConfig';
import { IConfig } from '..';


const ThemeContext = React.createContext({ appearance: 'light', setTheme: (mode: string) => {}, toggle: () => {} });

/**
 * @description A React Hook Component that allows for changes to theme, uses useContext()
 */
export const useTheme = () => React.useContext(ThemeContext);

/**
 * @description A React Component That manages the Theme Context
 */
export const ThemeContextProvider = (props: any) => {

    const [config, setConfig] = useState<Partial<IConfig> | null>(null);
    const [themeState, setThemeState] = useState({
        mode: 'light'
    })

    /**
   * @description subscribes to config and makes sure that Appearance variable is upto date
   */
    useEffect(() => {
        const listener = rxConfig.subscribe((mConfig: IConfig) => {
            setConfig(mConfig);
            console.log(mConfig.appearance);
            setThemeState({ mode: mConfig.appearance })
        });

        return () => {
        listener.unsubscribe();
        };
    }, []);

    // Toggles Betweem 'light' and 'dark' values
    const toggle = () => {
        const mode = (themeState.mode === 'light' ? 'dark' : 'light');
        setThemeState({ mode: mode });
        updateConfig({ appearance: mode }).catch(err => null);
    }

    // Toggles Betweem 'light' and 'dark' values
    const setTheme = (mode: string) => {
        setThemeState({ mode: mode });
        updateConfig({ appearance: mode }).catch(err => null);
    }

    return(
        <ThemeContext.Provider value={{ appearance: themeState.mode, setTheme: setTheme, toggle: toggle}} >
            <ThemeProvider theme={{ mode: themeState.mode }}>
                {props.children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;