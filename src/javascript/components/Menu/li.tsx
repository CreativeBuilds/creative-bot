import * as React from 'react';
import { useState } from 'react';

const Li = ({ children, hoverStyle = {}, style = {} }) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  let currentStyle = isHovering ? Object.assign({}, style, hoverStyle) : style;
  return (
    <li
      style={currentStyle}
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
    >
      {children}
    </li>
  );
};

export {Li}