import * as React from 'react';
import styled from 'styled-components';
import { ThemeSet } from 'styled-theming';

interface IHoverDivProps {
    hasBorder?: boolean;
    borderWidth?: string;
    borderColor?: string;
    borderType?: string;
    borderRadius?: string;
    cursor?: string;
}

export class HoverStyle implements IHoverDivProps {
    hasBorder?: boolean;
    borderWidth?: string;
    borderColor?: string;
    borderType?: string;
    borderRadius?: string;
    cursor?: string;

    constructor(hasBorder?: boolean, 
        borderWidth?: string, 
        borderColor?: string, 
        borderType?: string, 
        borderRadius?: string, 
        cursor?: string) {
            this.hasBorder = hasBorder;
            this.borderWidth = borderWidth;
            this.borderColor = borderColor;
            this.borderType = borderType;
            this.borderRadius = borderRadius;
            this.cursor = cursor;
    }
};

interface IAdvancedDivProps {
    aStyle?: {};
    aClassName?: string;
    className?: string;
    hoverClassName?: string;
    style?: {};
    hoverStyle?: HoverStyle;
    isButton?: Boolean;
    buttonStyle?: {};
    onClick?: () => void;
    onHover?: (e?: boolean) => void;
    children: any;
}

/**
 * @description Generic Hover for AdvancedDiv
 */
const HoverDiv = styled.div`
    padding: 0px;
    margin: 0px;

    &:Hover {
        border-width: ${(props: IHoverDivProps): string => props.hasBorder ? props.borderWidth ? props.borderWidth : '2px' : '0px'};
        border-color: ${(props: IHoverDivProps): string => props.hasBorder ? props.borderColor ? props.borderColor : '#ffffff' : 'transparent'};
        border-style: ${(props: IHoverDivProps): string => props.hasBorder ? props.borderType ? props.borderType : 'solid' : 'none'};
        border-radius: ${(props: IHoverDivProps): string => props.hasBorder ? props.borderRadius ? props.borderRadius : '0px' : '0px'};
        cursor: ${(props: IHoverDivProps): string => props.cursor ? props.cursor : 'none'};
    }
`;

/**
 * @description AdvancedDiv that Allows for more Complex User Interactions for Components
 */
export const AdvancedDiv = (props: IAdvancedDivProps) => {
    const {
      aStyle = {},
      aClassName = '',
      className = '',
      hoverClassName = '',
      style = {},
      hoverStyle = null,
      onClick = null,
      onHover = null,
    } = props;
    const [hover, setHover] = React.useState(false);
  
    if (!props.children) throw new Error('AdvancedDiv needs a child element!');
  
    if (!!props.children && !!props.children.length)
      throw new Error('AdvancedDiv can only have one child element!');
  
    return (
      <div
        onMouseEnter={() => {
          setHover(true);
          if (onHover != null) {
            onHover(true);
          }
        }}
        onMouseLeave={() => {
          setHover(false);
          if (onHover != null) {
            onHover(false);
          }
        }}
        style={aStyle}
        className={aClassName}
        onClick={onClick ? onClick : () => {}}
      >
        <HoverDiv 
            hasBorder={hoverStyle?.hasBorder} 
            borderWidth={hoverStyle?.borderWidth} 
            borderColor={hoverStyle?.borderColor} 
            borderType={hoverStyle?.borderType} 
            borderRadius={hoverStyle?.borderRadius}
            cursor={hoverStyle?.cursor}
            >
            {React.cloneElement(props.children, {
            isHovering: hover,
            className: `${className} ${hover ? hoverClassName : ''}`})}
        </HoverDiv>
      </div>
    );
  };