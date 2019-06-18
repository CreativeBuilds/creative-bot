import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { number } from 'prop-types';

const styles: any = require('./Slider.scss');

const Slider = ({header = "", hasHeader, minValue = 0, maxValue = 10, val = 5, onChange = null, style}) => {
    const [value, setValue] = useState<number>(val);
    return (
        <div className={styles.slider} style={style}>
            { hasHeader ? <div className={styles.header}>{header}</div>: null}
            <input className={styles.sliderInput} type="range" min={minValue} max={maxValue} value={value} onChange={(e) => {
                console.log(e.target.value);
                setValue(Number(e.target.value));
                onChange(e, Number(e.target.value));
            }}></input>
        </div>
    );
}

export { Slider }