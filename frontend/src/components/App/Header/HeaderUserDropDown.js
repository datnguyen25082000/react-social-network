import React from 'react';
import styled, { css } from 'styled-components';
import { generatePath, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import SignOut from 'components/App/SignOut';
import { A } from 'components/Text';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { AiFillSetting } from 'react-icons/ai';
import { MdSettingsBrightness } from 'react-icons/md';
import * as Routes from 'routes';

import { useStore } from 'store';

const Root = styled.div`
  text-align: center;
  width: 100%;
  position: absolute;
  background-color: white;
  line-height: ${(p) => p.theme.spacing.md};
  right: 0;
  top: 60px;
  z-index: ${(p) => p.theme.zIndex.xl};
  box-shadow: ${(p) => p.theme.shadows.sm};
  @media (min-width: ${(p) => p.theme.screen.sm}) {
    width: 280px;
  }
`;

const CSS = css`
  transition: background-color 0.1s;
  display: block;
  padding: 10px 20px;

  &:hover {
    background-color: ${(p) => p.theme.colors.grey[200]};
    color: ${(p) => p.theme.colors.text.secondary};
  }
`;

const Link = styled(A)`
  ${CSS};
`;

const Item = styled.div`
  ${CSS};
  display: flex;
  cursor: pointer;
  flex-direction: rows;
  align-items: center;
  & > svg {
    margin-right: 10px;
  }
  & > span {
    font-size: 15px;
  }
`;

const Spacing = styled.div`
  width: 100%;
  height: 1px;
  background-color: #aaa;
`;

/**
 * Component that renders Header User's dropdown
 */
const HeaderUserDropDown = ({ userRef }) => {
  const [{ auth }] = useStore();
  const history = useHistory();
  return (
    <Root ref={userRef}>
      <Item
        onClick={() => {
          history.push(
            generatePath(Routes.USER_PROFILE, {
              username: auth.user.username,
            })
          );
        }}
      >
        <CgProfile size={20} />
        <span>My profile</span>
      </Item>

      <Item>
        <RiLogoutCircleRLine size={20} />
        <SignOut />
      </Item>

      <Spacing></Spacing>
      <Item>
        <MdSettingsBrightness size={20} />
        <span>Theme</span>
      </Item>

      <Item>
        <AiFillSetting size={20} />
        <span>Setting</span>
      </Item>
    </Root>
  );
};

HeaderUserDropDown.propTypes = {
  userRef: PropTypes.object,
};

export default HeaderUserDropDown;
