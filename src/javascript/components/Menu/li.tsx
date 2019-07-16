import * as React from 'react';
import { useState } from 'react';

import { AdvancedDiv } from '../Generics/AdvancedDiv';

const Li = ({ children, hoverStyle = {}, style = {}, onClick = (e)=>{} }) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  let currentStyle = isHovering ? Object.assign({}, style, hoverStyle) : style;
  return (
    <li
      style={currentStyle}
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onClick={onClick}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
    >
      {children}
    </li>
  );
};

export {Li}