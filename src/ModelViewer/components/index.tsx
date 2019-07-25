import * as React from 'react';

export const Button = ({ children, style, ...rest }: any) => (
  <button
    {...rest}
    style={{
      background: 'none',
      border: 'none',
      margin: 0,
      padding: '0 8px',
      display: 'flex',
      alignItems: 'center',
      color: '#fff',
      cursor: 'pointer',
      ...style
    }}
  >
    {children}
  </button>
);

export const Progress = ({ progress, style, ...rest }) => (
  <progress
    max={100}
    value={progress}
    style={{ display: 'block', ...style }}
    {...rest}
  />
);

export const Container = ({
  children,
  position = 'static',
  display = 'flex',
  direction = 'row',
  align,
  justify,
  top,
  bottom,
  left,
  right,
  width,
  height,
  style,
}: {
  children?: React.ReactNode;
  display?: string;
  position?: string;
  direction?: string;
  align?: string;
  justify?: string;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  width?: number | string;
  height?: number | string;
  style?: Object;
}) => (
  <div
    style={{
      display,
      position,
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      top,
      bottom,
      left,
      right,
      width,
      height,
      ...style
    }}
  >
    {children}
  </div>
);
