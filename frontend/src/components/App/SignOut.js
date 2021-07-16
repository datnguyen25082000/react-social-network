import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/client';
import { withRouter } from 'react-router-dom';

import { Button } from 'components/Form';

import * as Routes from 'routes';

import { useStore } from 'store';
import { CLEAR_AUTH_USER } from 'store/auth';

/**
 * Component that signs out the user
 */
const SignOut = ({ history }) => {
  const client = useApolloClient();
  const [, dispatch] = useStore();

  const handleSignOut = () => {
    dispatch({ type: CLEAR_AUTH_USER });
    localStorage.removeItem('token');
    client.resetStore();
    history.push(Routes.HOME);
  };

  return (
    <span onClick={handleSignOut}>
      Sign out
    </span>
  );
};

SignOut.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(SignOut);
