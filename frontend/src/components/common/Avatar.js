import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {SvgAvatar} from '../../assets/svg'

const Root = styled.div`
  width: ${(p) => (p.size ? `${p.size}px` : '30px')};
  height: ${(p) => (p.size ? `${p.size}px` : '30px')};
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 10px; 
  border: 1px #aaa solid;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/**
 * Component for rendering user's image
 */
export const Avatar = ({ size, image }) => (
  <Root size={size}>{image ? <Image src={image} /> : <SvgAvatar width="100%" height="100%"/>}</Root>
);

Avatar.propTypes = {
  size: PropTypes.number,
  image: PropTypes.string,
};