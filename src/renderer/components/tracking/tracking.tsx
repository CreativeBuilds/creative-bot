import * as React from 'react';
import { getUA, pageview } from '@/renderer/helpers/reactGA';
import { withRouter, WithRouterProps, RouteComponentProps } from 'react-router';

/**
 * @description simple module for tracking how many active users there are
 */
interface IProps extends RouteComponentProps {
  path: string;
}
const TrackingComponent = (props: IProps) => {
  React.useEffect(() => {
    console.log('ON PAGE VIEW', window.location.hash);
    pageview(props.path);
  }, []);

  return null;
};
export const Tracking = withRouter(TrackingComponent);
