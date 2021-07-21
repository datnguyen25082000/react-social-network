import React, { useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { Confirm } from "./Confirm";
import { Overlay } from "./Layout";

const Root = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: ${(p) => p.theme.zIndex.lg};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media (min-width: ${(p) => p.theme.screen.md}) {
    align-items: center;
    top: 0;
  }
`;

/**
 * Main component for rendering Modals
 */
export const Modal = ({ children, open, onClose, type, ...otherProps }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflowY = "scroll";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = ""
      document.body.style.position = 'relative'
    };
  }, [open]);

  if (!open) return null;

  return (
    <Root>
      <Overlay onClick={onClose}></Overlay>

      <div style={{ zIndex: "100000" }}>
        {type === "confirm" ? <Confirm {...otherProps} /> : children}
      </div>
    </Root>
  );
};

Modal.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["", "confirm"]),
};
