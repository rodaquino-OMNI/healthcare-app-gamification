import styled from 'styled-components';

interface BoxContainerProps {
  display?: string;
  flexDirection?: string;
  flexWrap?: string;
  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;
  flexGrow?: number | string;
  flexShrink?: number | string;
  flexBasis?: number | string;
  flex?: string;
  gap?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number | string;
  overflow?: string;
  overflowX?: string;
  overflowY?: string;
  color?: string;
  backgroundColor?: string;
  background?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string;
  boxShadow?: string;
  opacity?: number | string;
  cursor?: string;
  visibility?: string;
  textAlign?: string;
  transform?: string;
  transition?: string;
}

/**
 * BoxContainer is a flexible layout container component that accepts various styling
 * properties for layout, spacing, positioning, and visual appearance.
 * 
 * It provides a foundation for creating consistent UI elements throughout the application.
 */
export const BoxContainer = styled.div<BoxContainerProps>`
  /* Layout */
  display: ${props => props.display};
  flex-direction: ${props => props.flexDirection};
  flex-wrap: ${props => props.flexWrap};
  justify-content: ${props => props.justifyContent};
  align-items: ${props => props.alignItems};
  align-content: ${props => props.alignContent};
  flex-grow: ${props => props.flexGrow};
  flex-shrink: ${props => props.flexShrink};
  flex-basis: ${props => props.flexBasis};
  flex: ${props => props.flex};
  gap: ${props => props.gap};

  /* Dimensions */
  width: ${props => props.width};
  min-width: ${props => props.minWidth};
  max-width: ${props => props.maxWidth};
  height: ${props => props.height};
  min-height: ${props => props.minHeight};
  max-height: ${props => props.maxHeight};

  /* Spacing */
  margin: ${props => props.margin};
  margin-top: ${props => props.marginTop};
  margin-right: ${props => props.marginRight};
  margin-bottom: ${props => props.marginBottom};
  margin-left: ${props => props.marginLeft};

  padding: ${props => props.padding};
  padding-top: ${props => props.paddingTop};
  padding-right: ${props => props.paddingRight};
  padding-bottom: ${props => props.paddingBottom};
  padding-left: ${props => props.paddingLeft};

  /* Positioning */
  position: ${props => props.position};
  top: ${props => props.top};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
  left: ${props => props.left};
  z-index: ${props => props.zIndex};

  /* Visual Properties */
  overflow: ${props => props.overflow};
  overflow-x: ${props => props.overflowX};
  overflow-y: ${props => props.overflowY};
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor};
  background: ${props => props.background};
  background-image: ${props => props.backgroundImage};
  background-size: ${props => props.backgroundSize};
  background-position: ${props => props.backgroundPosition};
  background-repeat: ${props => props.backgroundRepeat};
  
  /* Borders */
  border: ${props => props.border};
  border-top: ${props => props.borderTop};
  border-right: ${props => props.borderRight};
  border-bottom: ${props => props.borderBottom};
  border-left: ${props => props.borderLeft};
  border-radius: ${props => props.borderRadius};
  
  /* Other Visual Effects */
  box-shadow: ${props => props.boxShadow};
  opacity: ${props => props.opacity};
  cursor: ${props => props.cursor};
  visibility: ${props => props.visibility};
  text-align: ${props => props.textAlign};
  transform: ${props => props.transform};
  transition: ${props => props.transition};
`;