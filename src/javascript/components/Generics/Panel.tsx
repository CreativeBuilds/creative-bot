import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';

const Panel = ({header = "", hasHeader, content, style = null, stateTheme}) => {

    return (
        <div style={Object.assign({}, style, stateTheme.panel)}>
            { hasHeader ? <h4 style={stateTheme.panel.title}>{header}</h4> : null}
            {content}
        </div>
    );
}

export { Panel }