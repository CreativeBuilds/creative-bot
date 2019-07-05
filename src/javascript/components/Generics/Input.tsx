import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { AdvancedDiv } from '../AdvancedDiv';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace, MdLocalMovies, MdEvent, MdFilterList } from 'react-icons/md';

const TextField = ({text = '', placeholderText = '', width = null, header = null, isEnabled = true, onChange = null, onKeyDown = null, onKeyUp = null, stateTheme, style = {}, inputStyle = {}}) => {
    
    const [isenabled, setIsEnabled] = useState(isEnabled);
    const [textInput, setTextInput] = useState(text);

    return (
        <div style={Object.assign({}, 
            Object.assign({}, width != null ? { width: width} : null, style), stateTheme.input.container)}>
            {header != null ?  <div style={stateTheme.input.header}>{header}</div> : null }
            <input
                type={'text'}
                placeholder={placeholderText}
                defaultValue={textInput}
                style={Object.assign(
                    {},
                    inputStyle
                    ,   
                    stateTheme.input.text 
                    )}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
            />
        </div>
    );
}

const EmailField = ({text = '', placeholderText = '', width = null, header = null, isEnabled = true, onChange = null, onKeyDown = null, onKeyUp = null, stateTheme, style = {}, inputStyle = {}}) => {
    
    const [isenabled, setIsEnabled] = useState(isEnabled);
    const [textInput, setTextInput] = useState(text);

    return (
        <div style={Object.assign({}, 
            Object.assign({}, width != null ? { width: width} : null, style) ,stateTheme.input.container)}>
            {header != null ?  <div style={stateTheme.input.header}>{header}</div> : null }
            <input
                type={'email'}
                placeholder={placeholderText}
                defaultValue={textInput}
                style={Object.assign(
                    {},
                    inputStyle
                    ,   
                    stateTheme.input.text 
                    )}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
            />
        </div>
    );
}

const PasswordField = ({text = '', placeholderText = '', width = null, header = null, isEnabled = true, hasForgotLabel = false, onChange = null, onKeyDown = null, onKeyUp = null, onForgotPassword = null, stateTheme, style = {}, inputStyle = {}}) => {
    
    const [isenabled, setIsEnabled] = useState(isEnabled);
    const [textInput, setTextInput] = useState(text);

    return (
        <div style={Object.assign({}, 
            Object.assign({}, width != null ? { width: width} : null, style) ,stateTheme.input.container)}>
            {header != null ?  
            <div style={stateTheme.input.header}>
                <span>{header}</span>
                { hasForgotLabel ? <AdvancedDiv
                style={{
                    fontSize: '0.7em',
                    color: theme.globals.accentHighlight.highlightColor
                }}
                hoverStyle={{ cursor: 'pointer' }}
                >
                <span onClick={onForgotPassword}>Forgot Password?</span>
                </AdvancedDiv> : null}
            </div> : null }
            <input
                type={'password'}
                placeholder={placeholderText}
                defaultValue={textInput}
                style={Object.assign(
                    {},
                    inputStyle
                    ,   
                    stateTheme.input.text 
                    )}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
            />
        </div>
    );
}

const StepperField = ({value = 0, minValue = 0, maxValue = 0, width = null, header = null, isEnabled = true, onChange = null, onKeyDown = null, onKeyUp = null, stateTheme, style = {}, inputStyle = {}}) => {
    
    const [isenabled, setIsEnabled] = useState(isEnabled);
    const [valueInput, setTextInput] = useState(value);

    return (
        <div style={Object.assign({}, 
            Object.assign({}, width != null ? { width: width} : null, style) ,stateTheme.input.container)}>
            {header != null ?  <div style={stateTheme.input.header}>{header}</div> : null }
            <input
                type={'number'}
                style={Object.assign(
                    {},
                    inputStyle
                    ,   
                    stateTheme.input.stepper
                    )}
                value={value}
                min={minValue}
                max={maxValue != 0 ? maxValue : null}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
            />
        </div>
    );
}

export {TextField, EmailField, PasswordField, StepperField}