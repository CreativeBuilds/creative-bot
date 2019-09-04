import * as React from 'react';
import { Toggle, Nav, NavItem, NavIcon, NavText, SideNav } from './StyledNav';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  FaHome,
  FaRegCommentAlt,
  FaRegComments,
  FaComments,
  FaUserAlt,
  FaGift,
  FaKeyboard,
  FaList,
  FaClock,
  FaCommentDots,
  FaSignOutAlt
} from 'react-icons/fa';
import { auth } from '../../helpers/firebase';

// tslint:disable-next-line: use-default-type-parameter
interface IProps extends RouteComponentProps<{}> {}

/**
 * @description Menu component that generate the side menu
 */
const MenuComponent = (
  props: IProps
): React.FunctionComponentElement<IProps> => {
  console.log(props);

  const sideNavSelect = async (selected: string): Promise<void> => {
    if (selected === '/logout') {
      await auth.signOut();
      window.location.href = '/';
    } else {
      props.history.push(selected);
    }
  };

  return (
    <SideNav onSelect={sideNavSelect} id={'menu'}>
      <Toggle id={'menu-toggle'} />
      <Nav
        defaultSelected={props.location.pathname ? props.location.pathname : ''}
      >
        <NavItem eventKey='/'>
          <NavIcon>
            <FaComments
              style={{ fontSize: '30px', width: '30px', height: '45px' }}
            ></FaComments>
          </NavIcon>
          <NavText>CHAT</NavText>
        </NavItem>
        <NavItem eventKey='/users'>
          <NavIcon>
            <FaUserAlt
              style={{ fontSize: '30px', width: '30px', height: '45px' }}
            ></FaUserAlt>
          </NavIcon>
          <NavText>USERS</NavText>
        </NavItem>
        <NavItem eventKey='/giveaways'>
          <NavIcon>
            <FaGift
              style={{ fontSize: '30px', width: '30px', height: '45px' }}
            ></FaGift>
          </NavIcon>
          <NavText>GIVEAWAYS</NavText>
        </NavItem>
        <NavItem eventKey='/commands'>
          <NavIcon>
            <FaList
              style={{ fontSize: '30px', width: '30px', height: '45px' }}
            ></FaList>
          </NavIcon>
          <NavText>COMMANDS</NavText>
        </NavItem>
        <NavItem eventKey='/timers'>
          <NavIcon>
            <FaClock
              style={{ fontSize: '30px', width: '30px', height: '45px' }}
            ></FaClock>
          </NavIcon>
          <NavText>TIMERS</NavText>
        </NavItem>
        <NavItem eventKey='/quotes'>
          <NavIcon>
            <FaCommentDots
              style={{ fontSize: '30px', width: '30px', height: '45px' }}
            ></FaCommentDots>
          </NavIcon>
          <NavText>QUOTES</NavText>
        </NavItem>
        <NavItem eventKey='/logout'>
          <NavIcon>
            <FaSignOutAlt
              style={{ fontSize: '30px', width: '30px', height: '45px' }}
            ></FaSignOutAlt>
          </NavIcon>
          <NavText>LOGOUT</NavText>
        </NavItem>
      </Nav>
    </SideNav>
  );
};

export const Menu = withRouter(MenuComponent);
