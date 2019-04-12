import * as React from 'react';
import { useState } from 'react';

const Li = ({ children, hoverStyle = {}, style = {} }) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  console.log("style", style, hoverStyle);
  let currentStyle = isHovering ? Object.assign({}, style, hoverStyle) : style;
  console.log(currentStyle, isHovering, style, hoverStyle);
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