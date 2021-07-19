import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import HeaderUserDropDown from "./HeaderUserDropDown";
import HeaderNotificationDropDown from "./HeaderNotificationDropDown";
import HeaderMessageDropdown from "./HeaderMessageDropdown";

/**
 * Component that renders DropDown's of Header
 */

const Root = styled.div`
  position: absolute;
  width: 100%;
  max-height: 350px;
  overflow-y: auto;
  background-color: white;
  right: 0;
  visibility: hidden;
  opacity: 0;
  top: 100%;
  transform: translateY(-1em);

  z-index: ${(p) => p.theme.zIndex.xl};
  border: 1px #aaa solid;
  @media (min-width: ${(p) => p.theme.screen.sm}) {
    width: 280px;
  }

  transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s,
    z-index 0s linear 0.01s;

  ${(props) =>
    props.visibility &&
    css`
      visibility: visible; /* shows sub-menu */
      opacity: 1;
      z-index: 1;
      transform: translateY(0%);
      transition-delay: 0s, 0s, 0.3s;
    `};
`;

const HeaderDropDowns = ({
  messageRef,
  notificationRef,
  userRef,
  dropdownOpen,
  dropdownData,
  closeDropDown,
}) => {
  const DropDowns = {
    USER: <HeaderUserDropDown userRef={userRef} />,
    NOTIFICATION: (
      <HeaderNotificationDropDown
        notificationRef={notificationRef}
        dropdownData={dropdownData}
        closeDropDown={closeDropDown}
      />
    ),
    MESSAGE: (
      <HeaderMessageDropdown
        messageRef={messageRef}
        dropdownData={dropdownData}
      />
    ),
  };

  return (
    <Root visibility={dropdownOpen ? true : false}>
      {dropdownOpen && DropDowns[dropdownOpen]}
    </Root>
  );
};

HeaderDropDowns.propTypes = {
  messageRef: PropTypes.object,
  notificationRef: PropTypes.object,
  userRef: PropTypes.object,
  dropdownOpen: PropTypes.string,
  dropdownData: PropTypes.array,
  closeDropDown: PropTypes.func,
};

export default HeaderDropDowns;
