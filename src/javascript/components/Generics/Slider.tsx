import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { theme, ThemeContext } from '../../helpers';
import { number } from 'prop-types';

const RangeSlider = ({
  header = '',
  hasHeader,
  minValue = 0,
  maxValue = 10,
  val = 100 < (maxValue || 10) ? 100 : 5,
  valType = '',
  onChange = null,
  onValueChanged = null,
  style = null,
  stateTheme = null
}) => {
  const [Value, setValue] = useState<number>(val);
  const [isChanging, setIsChanging] = useState<Boolean>(false);
  return (
      <div style={Object.assign({}, style, stateTheme.slider)}>
        {hasHeader ? (
          <div style={Object.assign({}, stateTheme.slider.headerContainer)}>
            <div style={Object.assign({}, stateTheme.slider.headerContainer.header)}>{header}</div>
            <div style={Object.assign({}, stateTheme.slider.headerContainer.value)}>
              {Value}
              {valType}
            </div>
          </div>
        ) : null}
        <Slider 
          style={stateTheme.slider.input}
          defaultValue={val} 
          min={minValue} 
          max={maxValue} 
          onChange={(value) => {
            setValue(Number(value));
            if (onChange != null) {
              onChange(Number(value));
            }
          }} 
          onAfterChange={(value) => {
            console.log(value);
            setValue(Number(value)); 
            if (onValueChanged != null) {
              onValueChanged(Number(value));
            }
          }} 
          trackStyle={Object.assign({}, theme.globals.accentDarkBackground, stateTheme.slider.track)}
          railStyle={Object.assign({}, stateTheme.base.background, stateTheme.slider.rail)}
          handleStyle={Object.assign({}, theme.globals.accentBackground ,stateTheme.slider.thumb)}/>
      </div>
  );
};

export { RangeSlider };
