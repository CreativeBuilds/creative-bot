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
  PopupDialogBackIcon
} from '../generic-styled-components/PopupDialog';
import { Button } from '../generic-styled-components/Button';
import * as validator from 'email-validator';
import { createUser, auth } from '@/renderer/helpers/firebase';
import { FaLongArrowAltLeft } from 'react-icons/fa';

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
 * @description wraps the buttons on the bottom and uses flex to space them out accordingly
 */
const LoginButtonWrapper = styled.div`
  display: flex;
  position: absolute;
  bottom: 15px;
  left: 0px;
  right: 0px;
  width: 85%;
  margin: auto;
  & > button {
    flex: 1;
    margin-left: 5px;
    margin-right: 5px;
  }
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

/**
 * @description returns the login page in its entirety and handles if the user is logged in or not.
 */
const Login = () => {
  const [create, setCreate] = React.useState(false);
  const [login, setLogin] = React.useState(false);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
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
    setPassword(e.target.value);
  };

  /**
   * @param e Regular input element change
   * @description sets email when the user types text
   */
  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    console.log(validator.validate(e.target.value));
  };

  /**
   * @description actually sends the account creation info to firebase
   */
  const createAccount = (): void => {
    createUser(email, password)
      .then(() => {
        console.log('MADE ACCOUNT!');
      })
      .catch(err => {
        console.error(err);
      });
  };

  /**
   * @description Takes login info and logins with firebase
   */
  const loginToAccount = (): void => {
    auth.signInWithEmailAndPassword(email, password).catch(err => {
      // tslint:disable-next-line: no-console
      console.error(err);
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
    return password.length < 8 || !validator.validate(email);
  };

  /**
   * @description sends user back to the initial start screen
   */
  const backToMain = (): void => {
    setCreate(false);
    setLogin(false);
  };

  return (
    <LoginMain>
      <PopupDialog width={'350px'} minHeight={'300px'}>
        {create === true ? (
          <React.Fragment>
            <PopupDialogBackIcon>
              <FaLongArrowAltLeft onClick={backToMain} />
            </PopupDialogBackIcon>
            <PopupDialogTitle center>Create an Account</PopupDialogTitle>
            <PopupDialogText style={{ marginBottom: '10px' }}>
              Please enter an email and password to log into CreativeBot <br />{' '}
              <b>Note</b> this is seperate from your dlive account!
            </PopupDialogText>
            <PopupDialogInputWrapper>
              <PopupDialogInputName>Email</PopupDialogInputName>
              <PopupDialogInput value={email} onChange={updateEmail} />
              <PopupDialogInputInfo
                error
                isHidden={validator.validate(email) || email.length === 0}
              >
                That isn't an email
              </PopupDialogInputInfo>
            </PopupDialogInputWrapper>
            <PopupDialogInputWrapper>
              <PopupDialogInputName>Password</PopupDialogInputName>
              <PopupDialogInput
                type={'password'}
                value={password}
                onChange={updatePassword}
              />
              <PopupDialogInputInfo
                error
                isHidden={password.length > 8 || password.length === 0}
              >
                This password is too short!
              </PopupDialogInputInfo>
            </PopupDialogInputWrapper>
            <PopupDialogInputWrapper style={{ marginBottom: '60px' }}>
              <PopupDialogInputName>Confirm Password</PopupDialogInputName>
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
                This password doesn't match!
              </PopupDialogInputInfo>
            </PopupDialogInputWrapper>
            <LoginButtonWrapper>
              <Button
                onClick={isDisabled() ? (): null => null : createAccount}
                disabled={isDisabled()}
              >
                Create
              </Button>
            </LoginButtonWrapper>
          </React.Fragment>
        ) : login === true ? (
          <React.Fragment>
            <PopupDialogBackIcon>
              <FaLongArrowAltLeft onClick={backToMain} />
            </PopupDialogBackIcon>
            <PopupDialogTitle center>Create an Account</PopupDialogTitle>
            <PopupDialogText style={{ marginBottom: '10px' }}>
              Please enter an email and password to log into CreativeBot <br />{' '}
              <b>Note</b> this is seperate from your dlive account!
            </PopupDialogText>
            <PopupDialogInputWrapper>
              <PopupDialogInputName>Email</PopupDialogInputName>
              <PopupDialogInput value={email} onChange={updateEmail} />
              {/* <PopupDialogInputInfo
                error
                isHidden={validator.validate(email) || email.length === 0}
              >
                That isn't an email
              </PopupDialogInputInfo> */}
            </PopupDialogInputWrapper>
            <PopupDialogInputWrapper style={{ marginBottom: '60px' }}>
              <PopupDialogInputName>Password</PopupDialogInputName>
              <PopupDialogInput
                type={'password'}
                value={password}
                onChange={updatePassword}
              />
            </PopupDialogInputWrapper>
            <LoginButtonWrapper>
              <Button
                onClick={isDisabledLogin() ? (): null => null : loginToAccount}
                disabled={isDisabledLogin()}
              >
                Login
              </Button>
            </LoginButtonWrapper>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <PopupDialogTitle center>Welcome!</PopupDialogTitle>
            <PopupDialogText style={{ marginBottom: '20px' }}>
              Welcome to CreativeBot, the best DLive bot around!
            </PopupDialogText>
            <PopupDialogText style={{ marginBottom: '20px' }}>
              To get started either, create an account or login if you already
              have a <b>CreativeBot</b> account!
            </PopupDialogText>
            <LoginButtonWrapper>
              <Button onClick={handleLogin} inverted>
                Login
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </LoginButtonWrapper>
          </React.Fragment>
        )}
      </PopupDialog>
    </LoginMain>
  );
};

export { Login };
