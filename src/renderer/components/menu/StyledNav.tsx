/**
 * @description StyledNav is a custom css version of trendmicro/react-sidenav
 */

import styled from 'styled-components';
import SideNav from '@trendmicro/react-sidenav';
import React from 'react';
// import ,  from '@trendmicro/react-sidenav';
// tslint:disable-next-line: no-unsafe-any
const { Toggle, Nav, NavItem, NavIcon, NavText } = SideNav;

interface ISideNavProps {
  background?: string;
}

// SideNav
const StyledSideNav = styled(SideNav)`
  background: ${(props: ISideNavProps): string =>
    props.background ? props.background : ''};
  border-right: 2px 2px 4px rgba(0, 0, 0, 0.2);
  box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.2);
`;
// tslint:disable-next-line: no-unsafe-any
StyledSideNav.defaultProps = SideNav.defaultProps;

// Toggle
const StyledToggle = styled(Toggle)`
  background-color: #922cce;
`;
// tslint:disable-next-line: no-unsafe-any
StyledToggle.defaultProps = Toggle.defaultProps;

// Nav
const StyledNav = styled(Nav)`
  /* background-color: #922cce; */
  &&&[class*='sidenav-subnav--'] {
    /* background: #922cce !important; */
  }
  &[class*='sidenav-nav--'] {
    > [class*='expandable--'] {
      > [class*='sidenav-subnav--'] {
        background: #922cce;
        border: unset;
        font-weight: 300 !important;
        color: #fff;
        [class*='-navitem--'] {
          padding-top: 10px;
          padding-bottom: 10px;
        }
        [class*='-navitem--']:hover {
          /* background: #ad44eb; */
        }
      }
    }
  }
  &&[class*='expanded--'] {
    [class*='sidenav-subnav--'] {
      background: rgba(0, 0, 0, 0);
      > [class*='sidenav-subnavitem--'],
      > [class*='sidenav-subnavitem--']:hover {
        /* background: blue; */
        margin: 0 !important;
        > [class*='navitem--'] {
          /* color: #922ccedd; */
          padding-top: 10px;
          padding-bottom: 10px;
        }
      }
      > [class*='sidenav-subnavitem--']:hover {
        > [class*='navitem--'] {
          /* background-color: #ad44eb; */
        }
      }
      > [class*='sidenav-subnavitem--'][class*='selected--'] {
        > [class*='navitem--'] {
          /* color: #922cce; */
        }
        > [class*='navitem--']::before {
          border-left: 2px solid #ad44eb;
        }
      }
    }
  }
  && > [class*='sidenav-navitem--'] {
    > [class*='navitem--'] {
      /* background-color: #f1f1f1;
      color: #922ccedd; */
    }
  }
  && > [class*='sidenav-navitem--']:hover {
    > [class*='navitem--'] {
      /* background: #e1e1e1; */
    }
  }
  && > [class*='sidenav-navitem--'],
  && > [class*='sidenav-navitem--']:hover {
    > [class*='navitem--'] {
      [class*='navicon--'] {
        &,
        > * {
          /* color: #922ccedd; */
        }
      }
      [class*='navtext--'] {
        &,
        > * {
          /* color: #922ccedd; */
        }
      }
      [class*='sidenav-nav-text--'] {
        &,
        > * {
          /* color: #922ccedd; */
        }
      }
    }
  }
  && > [class*='sidenav-navitem--'][class*='highlighted--'],
  && > [class*='sidenav-navitem--'][class*='highlighted--']:hover {
    > [class*='navitem--'] {
      /* background-color: #922cce !important; */
      /* color: #f1f1f1; */
    }
    > [class*='navitem--'] {
      [class*='navicon--'],
      [class*='navtext--'] {
        &,
        > * {
          color: #f1f1f1;
        }
      }
      [class*='sidenav-nav-text--'] {
        font-weight: 700;
      }
    }
  }
`;
// tslint:disable-next-line: no-unsafe-any
StyledNav.defaultProps = Nav.defaultProps;

// NavItem
const StyledNavItem = styled(NavItem)`
  &&&:hover {
    [class*='navtext--'] {
      /* color: #922ccedd; */
    }
  }
`;
// tslint:disable-next-line: no-unsafe-any
StyledNavItem.defaultProps = NavItem.defaultProps;

// NavIcon
const StyledNavIcon = styled(NavIcon)`
  /* color: #922ccedd; */
`;
// tslint:disable-next-line: no-unsafe-any
StyledNavIcon.defaultProps = NavIcon.defaultProps;

// NavText
const StyledNavText = styled(NavText)`
  /* color: #922ccedd; */
`;
// tslint:disable-next-line: no-unsafe-any
StyledNavText.defaultProps = NavText.defaultProps;

export {
  StyledToggle as Toggle,
  StyledNav as Nav,
  StyledNavItem as NavItem,
  StyledNavIcon as NavIcon,
  StyledNavText as NavText,
  StyledSideNav as SideNav
};
