import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { useQuery } from "@apollo/client";
import styled from "styled-components";

import {
  Skeleton,
  Container,
  Spacing,
  CreatePost,
  NotFound,
  Loading,
  Head,
} from "components/common";
import ProfileInfo from "./ProfileInfo";
import ProfilePosts from "./ProfilePosts";
import { GET_USER } from "graphql/user";
import { useStore } from "store";

const Root = styled.div`
  width: 100%;

  @media (min-width: ${(p) => p.theme.screen.lg}) {
    margin-left: ${(p) => p.theme.spacing.lg};
    padding: 0;
  }
`;
/**
 * User Profile Page
 */
const Profile = ({ match }) => {
  const [{ auth }] = useStore();
  const { username } = match.params;
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { username },
  });

  const renderContent = () => {
    if (loading) {
      return (
        <Container padding="xxs">
          <Skeleton height={350} />
          <Container maxWidth="sm">
            <Spacing top="lg" bottom="lg">
              <Skeleton height={82} />
            </Spacing>
          </Container>
          <Loading top="lg" />
        </Container>
      );
    }

    if (error || !data.getUser) return <NotFound />;

    return (
      <Container padding="xxs">
        <ProfileInfo user={data.getUser} />

        <Container maxWidth="sm">
          <Spacing top="lg" bottom="lg">
            {username === auth.user.username && <CreatePost />}
          </Spacing>

          <ProfilePosts username={username} />
        </Container>
      </Container>
    );
  };

  return (
    <Root>
      <Head />

      {renderContent()}
    </Root>
  );
};

Profile.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(Profile);
