import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { AdvancedDiv } from './AdvancedDiv';
import { theme, ThemeContext } from '../../helpers';

const TextField = ({
  text = '',
  placeholderText = '',
  width = null,
  header = null,
  isEnabled = true,
  onChange = null,
  onKeyDown = null,
  onKeyUp = null,
  stateTheme,
  style = {},
  inputStyle = {}
}) => {
  const [isenabled, setIsEnabled] = useState(isEnabled);
  const [textInput, setTextInput] = useState(text);

  useEffect(() => {
    setTextInput(text);
  }, [text]);
  return (
    <div
      style={Object.assign(
        {},
        Object.assign({}, width != null ? { width: width } : null, style),
        stateTheme.input.container
      )}
    >
      {header != null ? (
        <div style={stateTheme.input.header}>{header}</div>
      ) : null}
      <input
        type={'text'}
        placeholder={placeholderText}
        value={textInput}
        style={Object.assign({}, inputStyle, stateTheme.input.text)}
        onChange={e => {
          if (!text) {
            setTextInput(e.target.value);
          }
          (onChange ? onChange : () => {})(e);
        }}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};

const TextFieldHotFix = ({
  text = '',
  placeholderText = '',
  width = null,
  header = null,
  isEnabled = true,
  onChange = e => {},
  onKeyDown = e => {},
  onKeyUp = e => {},
  stateTheme,
  style = {},
  inputStyle = {}
}) => {
  const [isenabled, setIsEnabled] = useState(isEnabled);
  // const [textInput, setTextInput] = useState(text);

  return (
    <div
      style={Object.assign(
        {},
        Object.assign({}, width != null ? { width: width } : null, style),
        stateTheme.input.container
      )}
    >
      {header != null ? (
        <div style={stateTheme.input.header}>{header}</div>
      ) : null}
      <input
        type={'text'}
        placeholder={placeholderText}
        value={text}
        style={Object.assign({}, inputStyle, stateTheme.input.text)}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};

const EmailField = ({
  text = '',
  placeholderText = '',
  width = null,
  header = null,
  isEnabled = true,
  onChange = null,
  onKeyDown = null,
  onKeyUp = null,
  stateTheme,
  style = {},
  inputStyle = {}
}) => {
  const [isenabled, setIsEnabled] = useState(isEnabled);
  const [textInput, setTextInput] = useState(text);

  return (
    <div
      style={Object.assign(
        {},
        Object.assign({}, width != null ? { width: width } : null, style),
        stateTheme.input.container
      )}
    >
      {header != null ? (
        <div style={stateTheme.input.header}>{header}</div>
      ) : null}
      <input
        type={'email'}
        placeholder={placeholderText}
        defaultValue={textInput}
        style={Object.assign({}, inputStyle, stateTheme.input.text)}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};

const PasswordField = ({
  text = '',
  placeholderText = '',
  width = null,
  header = null,
  isEnabled = true,
  hasForgotLabel = false,
  onChange = null,
  onKeyDown = null,
  onKeyUp = null,
  onForgotPassword = null,
  stateTheme,
  style = {},
  inputStyle = {}
}) => {
  const [isenabled, setIsEnabled] = useState(isEnabled);
  const [textInput, setTextInput] = useState(text);

  return (
    <div
      style={Object.assign(
        {},
        Object.assign({}, width != null ? { width: width } : null, style),
        stateTheme.input.container
      )}
    >
      {header != null ? (
        <div style={stateTheme.input.header}>
          <span>{header}</span>
          {hasForgotLabel ? (
            <AdvancedDiv
              style={{
                fontSize: '0.7em',
                color: theme.globals.accentHighlight.highlightColor
              }}
              hoverStyle={{ cursor: 'pointer' }}
            >
              <span onClick={onForgotPassword}>Forgot Password?</span>
            </AdvancedDiv>
          ) : null}
        </div>
      ) : null}
      <input
        type={'password'}
        placeholder={placeholderText}
        defaultValue={textInput}
        style={Object.assign({}, inputStyle, stateTheme.input.text)}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};

const StepperField = ({
  value = 0,
  minValue = 0,
  maxValue = 0,
  width = null,
  header = null,
  isEnabled = true,
  onChange = null,
  onKeyDown = null,
  onKeyUp = null,
  stateTheme,
  style = {},
  inputStyle = {}
}) => {
  return (
    <div
      style={Object.assign(
        {},
        Object.assign({}, width != null ? { width: width } : null, style),
        stateTheme.input.container
      )}
    >
      {header != null ? (
        <div style={stateTheme.input.header}>{header}</div>
      ) : null}
      <input
        type={'number'}
        style={Object.assign({}, inputStyle, stateTheme.input.stepper)}
        value={value}
        min={minValue}
        max={maxValue != 0 ? maxValue : null}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};

const MessageField = ({
  text = '',
  placeholderText = '',
  width = null,
  isEnabled = true,
  onChange = null,
  onKeyDown = null,
  onKeyUp = null,
  stateTheme,
  style = {},
  inputStyle = {}
}) => {
  const [isenabled, setIsEnabled] = useState(isEnabled);
  const [textInput, setTextInput] = useState(text);

  useEffect(() => {
    setTextInput(text);
  }, [text]);

  return (
    <AdvancedDiv
      aStyle={Object.assign(
        {},
        Object.assign({}, style, stateTheme.input.message)
      )}
      hoverStyle={Object.assign(
        {},
        theme.globals.accentBorderColor,
        stateTheme.input.message.hover
      )}
      style={Object.assign(
        {},
        stateTheme.base.quinaryBackground,
        stateTheme.input.message.textField
      )}
    >
      <input
        placeholder={placeholderText}
        defaultValue={text}
        maxLength={280}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
    </AdvancedDiv>
  );
};

const SearchField = ({
  text = '',
  placeholderText = '',
  width = null,
  header = null,
  isEnabled = true,
  onChange = null,
  onFocus = null,
  onBlur = null,
  onKeyDown = null,
  onKeyUp = null,
  stateTheme,
  style = {},
  inputStyle = {}
}) => {
  const [isenabled, setIsEnabled] = useState(isEnabled);
  const [textInput, setTextInput] = useState(text);

  return (
    <div
      style={Object.assign(
        {},
        Object.assign({}, width != null ? { width: width } : null, style),
        stateTheme.input.container
      )}
    >
      {header != null ? (
        <div style={stateTheme.input.header}>{header}</div>
      ) : null}
      <input
        type={'text'}
        placeholder={placeholderText}
        value={textInput}
        style={Object.assign({}, inputStyle, stateTheme.input.text)}
        onChange={e => {
          if (!text) {
            setTextInput(e.target.value);
          }
          (onChange ? onChange : () => {})(e);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};

export {
  TextField,
  TextFieldHotFix,
  EmailField,
  PasswordField,
  StepperField,
  MessageField
};
