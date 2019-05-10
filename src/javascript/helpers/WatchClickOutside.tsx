import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';

class WatchClickOutside extends Component<any, any> {
    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }
  
    componentWillMount() {
      document.body.addEventListener('click', this.handleClick);
    }
  
    componentWillUnmount() {
      // remember to remove all events to avoid memory leaks
      document.body.removeEventListener('click', this.handleClick);
    }
  
    handleClick(event) {
      let {container} = this.refs; 
      const {onClickedOutside} = this.props; 
      
      const {target} = event; 
      // if there is no proper callback - no point of checking
      if (typeof onClickedOutside !== 'function') {
        return;
    }
  
      // if target is container - container was not clicked outside
      // if container contains clicked target - click was not outside of it
      if (target !== container) {
        onClickedOutside(event); // clicked outside - fire callback
      }
    }
  
    render() {
      return (
        <div ref="container">
          {this.props.children}
        </div>
      );
    }
}

export { WatchClickOutside }