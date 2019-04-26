import * as React from 'react';

const Route = ({
  url,
  path,
  exact = false,
  Component,
  componentProps = {}
}) => {
  return (url === path && exact) || (!exact && url.includes(path)) ? (
    <Component props={componentProps} />
  ) : null;
};

export { Route };
