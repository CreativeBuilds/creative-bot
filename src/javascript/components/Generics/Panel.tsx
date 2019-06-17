import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';

const styles: any = require('./Panel.scss');

const Panel = ({header = "", hasHeader, content, style}) => {

    return (
        <div className={styles.panel} style={style}>
            { hasHeader ? <h4 className={styles.title}>{header}</h4> : null}
            {content}
        </div>
    );
}

export { Panel }