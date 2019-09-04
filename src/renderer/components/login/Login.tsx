import * as React from 'react';
import styled from 'styled-components';
import {
  PopupDialog,
  PopupDialogTitle,
  PopupDialogText,
  PopupDialogInput,
  PopupDialogInputWrapper,
  PopupDialogInputName,
  PopupDialogInputInfo
} from '../generic-styled-components/PopupDialog';
import { Button } from '../generic-styled-components/Button';
import * as validator from 'email-validator';
import { createUser } from '@/renderer/helpers/firebase';

const LoginMain = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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

  const handleCreate = (): void => {
    setCreate(true);
    setLogin(false);
  };

  const handleLogin = (): void => {
    setLogin(true);
    setCreate(false);
  };

  const updatePasswordConfirmation = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPasswordConfirmation(e.target.value);
  };

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    console.log(validator.validate(e.target.value));
  };

  const createAccount = (): void => {
    createUser(email, password)
      .then(() => {
        console.log('MADE ACCOUNT!');
      })
      .catch(err => {
        console.error(err);
      });
  };

  const isDisabled = (): boolean => {
    return (
      !(
        password === passwordConfirmation && passwordConfirmation.length !== 0
      ) ||
      !(validator.validate(email) && email.length !== 0) ||
      !(passwordConfirmation.length > 8)
    );
  };

  return (
    <LoginMain>
      <PopupDialog width={'350px'} minHeight={'300px'}>
        {create === true ? (
          <React.Fragment>
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
        ) : login === true ? null : (
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
              <Button inverted>Login</Button>
              <Button onClick={handleCreate}>Create</Button>
            </LoginButtonWrapper>
          </React.Fragment>
        )}
      </PopupDialog>
    </LoginMain>
  );
};

export { Login };
