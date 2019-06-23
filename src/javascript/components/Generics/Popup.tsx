import * as React from 'react';
import { Component } from 'react';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import { MdClose } from 'react-icons/md';
import { theme } from '../../helpers';

const styles: any = require('./popup.scss');

class Popup extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  state = {
    stateTheme: theme.dark
  };

  listener = null;

  changeTheme = (themeVal: String) => {
    if (themeVal == 'dark') {
      return theme.dark;
    } else if (themeVal == 'light') {
      return theme.light;
    } else {
      return theme.dark;
    }
  };

  componentDidMount() {
    this.listener = firebaseConfig$.subscribe((data: any) => {
      this.setState({ stateTheme: this.changeTheme(data.themeType) });
    });
  }

  componentWillUnmount() {
    this.listener.unsubscribe();
  }

  render() {
    return (
      <div className={`${styles.overlay}  ${styles.animated} animated fadeIn`}>
        <div
          className={`${styles.dialog} ${
            this.props.hasGradiant ? styles.startupBackground : ''
          } animated fadeInUp`}
          style={
            this.props.hasGradiant
              ? theme.dark
              : (this.state.stateTheme ? this.state.stateTheme : theme.dark)
                  .base.quinaryBackground
          }
        >
          {this.props.noX ? null : (
            <div className={styles.close}>
              <MdClose
                onClick={() => {
                  this.props.closePopup();
                }}
              />
            </div>
          )}
          {this.props.children}
        </div>
      </div>
    );
  }
}

export { Popup };
