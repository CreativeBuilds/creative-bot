import * as React from 'react';
import styled from 'styled-components';
import {
  PopupDialog,
  PopupDialogTitle,
  PopupDialogText,
  PopupDialogInput,
  PopupDialogInputWrapper,
  PopupDialogInputName,
  PopupDialogInputInfo,
  PopupDialogBackIcon,
  PopupButtonWrapper
} from '../generic-styled-components/popupDialog';
import { Button } from '../generic-styled-components/button';
import * as validator from 'email-validator';
import { createUser, auth } from '@/renderer/helpers/firebase';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { accentColor } from '@/renderer/helpers/appearance';
import { firebase } from '@/renderer/helpers/firebase';

/**
 * @description The main div for the login screeen
 */
const LoginMain = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/**
 * @description Wraps input to allow for name/description of inputs
 */
const LoginInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 85%;
  margin: auto;
`;

const ForgotPassword = styled(PopupDialogInputInfo)`
  color: ${accentColor};
  &:hover {
    cursor: pointer;
  }
`;

/**
 * @description returns the login page in its entirety and handles if the user is logged in or not.
 */
const Login = () => {
  const [create, setCreate] = React.useState(false);
  const [login, setLogin] = React.useState(false);
  const [passwordReset, setPasswordReset] = React.useState(false);
  const [resetEmailSent, setResetEmailSent] = React.useState(false);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('');

  /**
   * @descritpion triggers on Create button from main screen, sends user to account creation
   */
  const handleCreate = (): void => {
    setCreate(true);
    setLogin(false);
  };

  /**
   * @descritpion triggers on Login button from main screen, sends user to account login
   */
  const handleLogin = (): void => {
    setLogin(true);
    setCreate(false);
  };

  /**
   * @param e Regular input element change
   * @description sets password confirmation when the user types text
   */
  const updatePasswordConfirmation = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPasswordConfirmation(e.target.value);
  };

  /**
   * @param e Regular input element change
   * @description sets password when the user types text
   */
  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPasswordError(false);
    setPassword(e.target.value);
  };

  /**
   * @param e Regular input element change
   * @description sets email when the user types text
   */
  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  /**
   * @description actually sends the account creation info to firebase
   */
  const createAccount = (): void => {
    createUser(email, password).catch(err => null);
  };

  /**
   * @description Takes login info and logins with firebase
   */
  const loginToAccount = (): void => {
    auth.signInWithEmailAndPassword(email, password).catch(err => {
      setPassword('');
      setPasswordError(true);
    });
  };

  /**
   * @description checks to see if the user creation button should be disabled or not
   */
  const isDisabled = (): boolean => {
    return (
      !(
        password === passwordConfirmation && passwordConfirmation.length !== 0
      ) ||
      !(validator.validate(email) && email.length !== 0) ||
      !(passwordConfirmation.length > 8)
    );
  };

  /**
   * @description checks to see if the user login button should be disabled or not
   */
  const isDisabledLogin = (): boolean => {
    return password.length < 8 || !validator.validate(email) || passwordError;
  };

  const isDisabledReset = (): boolean => {
    return !validator.validate(email);
  };

  /**
   * @description sends user back to the initial start screen
   */
  const backToMain = (): void => {
    setCreate(false);
    setLogin(false);
  };

  const openForgotPassword = (): void => {
    setPasswordReset(true);
  };

  const closeForgotPassword = (): void => {
    setPasswordReset(false);
  };

  const resetPassword = () => {
    firebase.auth().sendPasswordResetEmail(email);
    setResetEmailSent(true);
    setPasswordReset(false);
  };

  const closeResetConfirm = (): void => {
    setPasswordReset(false);
    setResetEmailSent(false);
  };

  return (
    <LoginMain> 
      <PopupDialog width={'350px'} minHeight={'300px'}>
        {resetEmailSent === true ? (
          <React.Fragment>
            <PopupDialogBackIcon>
              <FaLongArrowAltLeft onClick={closeResetConfirm} />
            </PopupDialogBackIcon>
            <PopupDialogTitle center>
              {getPhrase('password_reset_sent')}
            </PopupDialogTitle>
            <PopupDialogText style={{ marginBottom: '10px' }}>
              {getPhrase('password_reset_check_email')}
            </PopupDialogText>
            <PopupButtonWrapper>
              <Button onClick={closeResetConfirm}>
                {getPhrase('Sounds Good!')}
              </Button>
            </PopupButtonWrapper>
          </React.Fragment>
        ) : passwordReset === true ? (
          <React.Fragment>
            <PopupDialogBackIcon>
              <FaLongArrowAltLeft onClick={closeForgotPassword} />
            </PopupDialogBackIcon>
            <PopupDialogTitle center>
              {getPhrase('password_reset_title')}
            </PopupDialogTitle>
            <PopupDialogText style={{ marginBottom: '10px' }}>
              {getPhrase('password_reset_email_will_send')}
            </PopupDialogText>
            <PopupDialogInputWrapper>
              <PopupDialogInputName>
                {getPhrase('login_email_title')}
              </PopupDialogInputName>
              <PopupDialogInput value={email} onChange={updateEmail} />
              <PopupDialogInputInfo
                error
                isHidden={validator.validate(email) || email.length === 0}
              >
                {getPhrase('login_email_error')}
              </PopupDialogInputInfo>
            </PopupDialogInputWrapper>
            <PopupButtonWrapper>
              <Button
                onClick={isDisabledReset() ? (): null => null : resetPassword}
                disabled={isDisabledReset()}
              >
                {getPhrase('password_reset_send_reset')}
              </Button>
            </PopupButtonWrapper>
          </React.Fragment>
        ) : create === true ? (
          <React.Fragment>
            <PopupDialogBackIcon>
              <FaLongArrowAltLeft onClick={backToMain} />
            </PopupDialogBackIcon>
            <PopupDialogTitle center>
              {getPhrase('login_create_title')}
            </PopupDialogTitle>
            <PopupDialogText style={{ marginBottom: '10px' }}>
              {getPhrase('login_create_pleaseenter')}
              <br /> <b>{getPhrase('login_note')}</b>{' '}
              {getPhrase('login_create_warning')}
            </PopupDialogText>
            <PopupDialogInputWrapper>
              <PopupDialogInputName>
                {getPhrase('login_email')}
              </PopupDialogInputName>
              <PopupDialogInput value={email} onChange={updateEmail} />
              <PopupDialogInputInfo
                error
                isHidden={validator.validate(email) || email.length === 0}
              >
                {getPhrase('login_email_error')}
              </PopupDialogInputInfo>
            </PopupDialogInputWrapper>
            <PopupDialogInputWrapper>
              <PopupDialogInputName>
                {getPhrase('login_password')}
              </PopupDialogInputName>
              <PopupDialogInput
                type={'password'}
                value={password}
                onChange={updatePassword}
              />
              <PopupDialogInputInfo
                error
                isHidden={password.length > 8 || password.length === 0}
              >
                {getPhrase('login_password_error')}
              </PopupDialogInputInfo>
            </PopupDialogInputWrapper>
            <PopupDialogInputWrapper style={{ marginBottom: '60px' }}>
              <PopupDialogInputName>
                {getPhrase('login_password_confirm')}
              </PopupDialogInputName>
              <PopupDialogInput
                type={'password'}
                value={passwordConfirmation}
                onChange={updatePasswordConfirmation}
              />
              <PopupDialogInputInfo
                error
                isHidden={
                  password === passwordConfirmation ||
                  passwordConfirmation.length === 0
                }
              >
                {getPhrase('login_password_confirm_error')}
              </PopupDialogInputInfo>
            </PopupDialogInputWrapper>
            <PopupButtonWrapper>
              <Button
                onClick={isDisabled() ? (): null => null : createAccount}
                disabled={isDisabled()}
              >
                {getPhrase('login_create')}
              </Button>
            </PopupButtonWrapper>
          </React.Fragment>
        ) : login === true ? (
          <React.Fragment>
            <PopupDialogBackIcon>
              <FaLongArrowAltLeft onClick={backToMain} />
            </PopupDialogBackIcon>
            <PopupDialogTitle center>
              {getPhrase('login_login_title')}
            </PopupDialogTitle>
            <PopupDialogText style={{ marginBottom: '10px' }}>
              {getPhrase('login_create_pleaseenter')}
              <br /> <b>{getPhrase('login_note')}</b>{' '}
              {getPhrase('login_create_warning')}
            </PopupDialogText>
            <PopupDialogInputWrapper>
              <PopupDialogInputName>
                {getPhrase('login_email')}
              </PopupDialogInputName>
              <PopupDialogInput value={email} onChange={updateEmail} />
              {/* <PopupDialogInputInfo
                error
                isHidden={validator.validate(email) || email.length === 0}
              >
                That isn't an email
              </PopupDialogInputInfo> */}
            </PopupDialogInputWrapper>
            <PopupDialogInputWrapper style={{ marginBottom: '60px' }}>
              <PopupDialogInputName>
                {getPhrase('login_password')}
              </PopupDialogInputName>
              <PopupDialogInput
                type={'password'}
                value={password}
                onChange={updatePassword}
              />
              <PopupDialogInputInfo error={true} isHidden={!passwordError}>
                {getPhrase('login_invalid_password')}
              </PopupDialogInputInfo>
              <ForgotPassword onClick={openForgotPassword}>
                {getPhrase('password_reset_prompt')}
              </ForgotPassword>
            </PopupDialogInputWrapper>
            <PopupButtonWrapper>
              <Button
                onClick={isDisabledLogin() ? (): null => null : loginToAccount}
                disabled={isDisabledLogin()}
              >
                {getPhrase('login_logintext')}
              </Button>
            </PopupButtonWrapper>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <PopupDialogTitle center>
              {getPhrase('welcome_title')}
            </PopupDialogTitle>
            <PopupDialogText style={{ marginBottom: '20px' }}>
              {getPhrase('welcome_text_first')}
            </PopupDialogText>
            <PopupDialogText style={{ marginBottom: '60px' }}>
              {getPhrase('welcome_text_second_one')} <b>{getPhrase('name')}</b>{' '}
              {getPhrase('welcome_text_second_two')}
            </PopupDialogText>
            <PopupButtonWrapper>
              <Button onClick={handleLogin} inverted>
                {getPhrase('login_logintext')}
              </Button>
              <Button onClick={handleCreate}>
                {getPhrase('login_create')}
              </Button>
            </PopupButtonWrapper>
          </React.Fragment>
        )}
      </PopupDialog>
    </LoginMain>
  );
};

export { Login };
