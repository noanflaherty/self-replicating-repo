import React from 'react';

export const Button = (props) => {
  const { handleClick, buttonText } = props;
  return (
    <button onClick={handleClick}>{buttonText}</button>
  );
};
