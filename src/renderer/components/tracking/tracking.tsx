import * as React from 'react';
import { withRouter, WithRouterProps, RouteComponentProps } from 'react-router';
import { pageview } from '../../helpers/reactGA';

/**
 * @description simple module for tracking how many active users there are
 */
interface IProps extends RouteComponentProps {
  path: string;
}
const TrackingComponent = (props: IProps) => {
  React.useEffect(() => {
    pageview(props.path);
  }, []);

  return null;
};
export const Tracking = withRouter(TrackingComponent);
