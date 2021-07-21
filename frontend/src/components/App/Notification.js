import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { generatePath, useHistory } from "react-router-dom";
import styled from "styled-components";
import { useApolloClient } from "@apollo/client";

import { A, Spacing, Avatar } from "components/common";
import { useClickOutside } from "hooks/useClickOutside";

import { GET_AUTH_USER } from "graphql/user";
import { UPDATE_NOTIFICATION_SEEN } from "graphql/notification";
import { timeAgo } from "utils/date";
import { useStore } from "store";

import * as Routes from "routes";

const NotificationItem = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  align-items: center;
  padding: ${(p) => p.theme.spacing.xs};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.main};
  font-size: ${(p) => p.theme.font.size.xxs};
  background-color: ${(p) => p.theme.colors.white};

  &:last-child {
    border-bottom: 0;
  }
  &:hover {
    background-color: #f1f1f1;
  }
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Name = styled.span`
  font-weight: ${(p) => p.theme.font.weight.bold};
  font-size: 14px;
`;

const Action = styled.span`
  margin-left: ${(p) => p.theme.spacing.xs};
  font-size: 14px;
`;

const PostImage = styled.div`
  width: 40px;
  height: 40px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const CreatedAt = styled.div`
  font-size: ${(p) => p.theme.font.size.xxs};
  color: #aaa;
  border-bottom: 1px solid ${(p) => p.theme.colors.text.secondary};
  border: 0;
  margin-top: 5px;
`;
const RightSide = styled.div``;

/**
 * Renders user notifications
 */
const Notification = ({ notification, close }) => {
  const [{ auth }] = useStore();
  const client = useApolloClient();
  const ref = React.useRef(null);
  const history = useHistory();
  useClickOutside(ref, close);

  useEffect(() => {
    console.log("notification", notification);
    const updateNotificationSeen = async () => {
      try {
        await client.mutate({
          mutation: UPDATE_NOTIFICATION_SEEN,
          variables: {
            input: {
              userId: auth.user.id,
            },
          },
          refetchQueries: () => [{ query: GET_AUTH_USER }],
        });
      } catch (err) {}
    };

    updateNotificationSeen();
  }, [auth.user.id, auth.user.newNotifications.length, client]);

  if (!notification.follow && !notification.like && !notification.comment) {
    return null;
  }

  return (
    <NotificationItem
      ref={ref}
      onClick={() => {
        if (notification.like)
          history.push(`/post/${notification.like.post.id}`);
        if (notification.follow)
          history.push(`/${notification.author.username}`);
        if (notification.comment)
          history.push(`/post/${notification.comment.post.id}`);
      }}
    >
      <A
        to={generatePath(Routes.USER_PROFILE, {
          username: notification.author.username,
        })}
      >
        <LeftSide>
          <Avatar image={notification.author.image} size={60} />

          <Spacing left="xs" />
        </LeftSide>
      </A>
      <RightSide>
        <span>
          <Name>{notification.author.fullName}</Name>
          {notification.follow && <Action>started following you</Action>}

          {notification.like && (
            <Action>
              likes your post
              <A
                to={generatePath(Routes.POST, {
                  id: notification.like.post.id,
                })}
              >
                {/* <PostImage>
                  <Image src={notification.like.post.image} />
                </PostImage> */}
              </A>
            </Action>
          )}

          {notification.comment && (
            <Action>
              commented on your post
              <A
                to={generatePath(Routes.POST, {
                  id: notification.comment.post.id,
                })}
              >
                {/* <PostImage>
                  <Image src={notification.comment.post.image} />
                </PostImage> */}
              </A>
            </Action>
          )}
        </span>
        <CreatedAt>{timeAgo(notification.createdAt) + " ago"}</CreatedAt>
      </RightSide>
    </NotificationItem>
  );
};

Notification.propTypes = {
  close: PropTypes.func,
};

export default Notification;
