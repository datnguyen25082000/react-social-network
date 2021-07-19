import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Notification from '../Notification';
import SvgMessage from '../../../assets/svg/message.svg';

const Root = styled.div`

`;

const Empty = styled.div`
  padding: ${(p) => p.theme.spacing.xs};
  color: #aaa;
  margin-top: 20px;
`;

/**
 * Component that renders Header Notification's dropdown
 */
const HeaderNotificationDropDown = ({ notificationRef, dropdownData, closeDropDown }) => {
  return (
    <Root ref={notificationRef}>
      {!dropdownData.length ? (
        <div
          style={{
            padding: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <img style={{ width: '60%' }} src={SvgMessage} alt='logo 2' />
          <Empty>No new notifications.</Empty>
        </div>
      ) : (
        dropdownData.map((notification) => (
          <Notification key={notification.id} notification={notification} close={closeDropDown} />
        ))
      )}
    </Root>
  );
};

HeaderNotificationDropDown.propTypes = {
  notificationRef: PropTypes.object,
  dropdownData: PropTypes.array,
  closeDropDown: PropTypes.func,
};

export default HeaderNotificationDropDown;
