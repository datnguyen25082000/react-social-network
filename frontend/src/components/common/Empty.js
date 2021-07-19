import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EmptyIcon } from 'components/icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * Component for displaying when there is no data provided
 */
export const Empty = ({ text }) => (
  <Container>
    <EmptyIcon />

    {text}
  </Container>
);

Empty.propTypes = {
  text: PropTypes.string.isRequired,
};
