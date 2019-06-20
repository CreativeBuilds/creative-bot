import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { number } from 'prop-types';

const styles: any = require('./Slider.scss');

const Slider = ({header = "", hasHeader, minValue = 0, maxValue = 10, val = 5, valType = "", onChange = null, onValueChanged = null, style}) => {
    const [value, setValue] = useState<number>(val);
    const [isChanging, setIsChanging] = useState<Boolean>(false);
    return (
        <div className={styles.slider} style={style}>
            { hasHeader ? 
            <div className={styles.headerContainer}>
                <div className={styles.header}>{header}</div>
                <div className={styles.value}>{value}{valType}</div>
            </div>
            : null}
            <input id="myRange" className={styles.sliderInput} type="range" min={minValue} max={maxValue} value={value} onMouseDown={() => { setIsChanging(true); }} onMouseUp={() => { setIsChanging(false); if (onValueChanged != null) { onValueChanged(value); console.log("True Slider Value: ", value); }}} onChange={(e) => {
                setValue(Number(e.target.value));
                if (onChange != null) {
                    onChange(e, Number(e.target.value));
                }
            }}></input>
        </div>
    );
}

export { Slider }