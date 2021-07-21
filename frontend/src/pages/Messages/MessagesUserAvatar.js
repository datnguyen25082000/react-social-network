import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Avatar } from "components/common";
import { IS_USER_ONLINE_SUBSCRIPTION } from "graphql/user";
import { useSubscription } from "@apollo/client";
import { useStore } from "store";

const User = styled(NavLink)`
  width: 100%;
  padding: ${(p) => p.theme.spacing.xxs} ${(p) => p.theme.spacing.xxs};
  margin-bottom: ${(p) => p.theme.spacing.xxs};
  border-radius: ${(p) => p.theme.radius.md};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-decoration: none;
  color: ${(p) => p.theme.colors.text.primary};

  @media (max-width: ${(p) => p.theme.screen.lg}) {
    ${(p) =>
      !p.seen &&
      `
        background-color: ${p.theme.colors.primary.light};
      `};
  }

  &.selected, &:hover {
    background-color: ${(p) => p.theme.colors.grey[300]};
  }
`;

const Info = styled.div`
  width: 100%;
  display: none;
  padding: 0 ${(p) => p.theme.spacing.xs};

  @media (min-width: ${(p) => p.theme.screen.lg}) {
    display: block;
  }
`;

const FullNameUnSeen = styled.div`
  width: 100%;
  font-size: ${(p) => p.theme.font.size.sm};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FullName = styled.div`
  text-overflow: ellipsis;
  width: 100%;
`;

const UnSeen = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${(p) => p.theme.colors.primary.light};
  border-radius: 50%;
`;

const LastMessage = styled.div`
  margin-top: ${(p) => p.theme.spacing.xxs};
  font-size: ${(p) => p.theme.font.size.xxs};
  color: ${(p) => p.theme.colors.grey[500]};
  text-overflow: ellipsis;
`;

const Online = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: ${(p) => p.theme.colors.success};
  margin-left: ${(p) => p.theme.spacing.xs};
  border-radius: 50%;
  bottom: 0;
  right: 10px;
  z-index: 1000;
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px
`;

/**
 * Component that renders users, with whom auth user had a chat
 */
const MessagesUserAvatar = ({ user, unseen }) => {
  const [{ auth }] = useStore();
  const [isOnline, setIsOnline] = useState(user?.isOnline || false);
  const { data, loading } = useSubscription(IS_USER_ONLINE_SUBSCRIPTION, {
    variables: {
      authUserId: auth.user.id,
      userId: user ? user.id : null,
    },
    skip: !user,
  });

  useEffect(() => {
    if (data) setIsOnline(data?.isUserOnline?.isOnline);
  }, [data]);

  return (
    <User
      key={user.id}
      activeClassName="selected"
      to={`/messages/${user.id}`}
      seen={unseen ? 0 : 1}
    >
      <div style={{position: 'relative'}}>
        <Avatar image={user.image} size={50} />
        {isOnline && <Online />}
      </div>

      <Info>
        <FullNameUnSeen>
          <FullName>{user.fullName}</FullName>

          {unseen && <UnSeen />}
        </FullNameUnSeen>

        <LastMessage>
          {user.lastMessageSender && "You:"} {user.lastMessage}
        </LastMessage>
      </Info>
    </User>
  );
};

MessagesUserAvatar.propTypes = {
  user: PropTypes.object.isRequired,
  unseen: PropTypes.object.isRequired,
};

export default MessagesUserAvatar;
