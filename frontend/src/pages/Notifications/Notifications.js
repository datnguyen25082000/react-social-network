import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";

import {
  Container,
  Content,
  Loading,
  Skeleton,
  InfiniteScroll,
  Empty,
  Head,
} from "components/common";
import Notification from "components/App/Notification";

import { useStore } from "store";

import { GET_USER_NOTIFICATION } from "graphql/notification";

import { NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT } from "constants/DataLimit";

const Root = styled(Container)`
  margin-top: ${(p) => p.theme.spacing.lg};
`;

const List = styled.div`
  overflow: hidden;
  border-radius: ${(p) => p.theme.radius.sm};
  border: 1px solid ${(p) => p.theme.colors.border.main};
`;

/**
 * Notifications page
 */
const Notifications = () => {
  const [{ auth }] = useStore();
  const variables = {
    userId: auth.user.id,
    skip: 0,
    limit: NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT,
  };
  const { data, loading, fetchMore, networkStatus } = useQuery(
    GET_USER_NOTIFICATION,
    {
      variables,
      notifyOnNetworkStatusChange: true,
    }
  );

  const renderContent = () => {
    if (loading && networkStatus === 1) {
      return (
        <>
          {" "}
          <Loading top="lg" />
          <Skeleton
            height={56}
            bottom="xxs"
            count={NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT}
          />
        </>
      );
    }

    const { notifications, count } = data.getUserNotifications;
    if (!notifications.length) {
      return <Empty text="No notifications yet." />;
    }

    return (
      <InfiniteScroll
        data={notifications}
        dataKey="getUserNotifications.notifications"
        count={parseInt(count)}
        variables={variables}
        fetchMore={fetchMore}
      >
        {(data) => {
          const showNextLoading =
            loading && networkStatus === 3 && count !== data.length;
          console.log("data", data);
          return (
            <>
              <List>
                {data.map((notification) => (
                  <Notification
                    key={notification.id}
                    notification={notification}
                    close={() => false}
                  />
                ))}
              </List>

              {showNextLoading && <Loading top="lg" />}
            </>
          );
        }}
      </InfiniteScroll>
    );
  };

  return (
    <Content>
      <Root maxWidth="md">
        <Head />

        {renderContent()}
      </Root>
    </Content>
  );
};

export default Notifications;
