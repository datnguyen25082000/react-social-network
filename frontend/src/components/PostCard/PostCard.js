import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { generatePath } from "react-router-dom";
import styled, { css } from "styled-components";
import { useApolloClient } from "@apollo/client";

import {
  Comment,
  CreateComment,
  Like,
  Spacing,
  A,
  H3,
  Button,
  Modal,
  Avatar,
} from "components/common";
import { DotsIcon, PostCommentIcon } from "components/icons";
import PostCardOption from "components/PostCard/PostCardOption";

import { GET_FOLLOWED_POSTS, DELETE_POST } from "graphql/post";
import { GET_AUTH_USER } from "graphql/user";
import { GET_USER_POSTS } from "graphql/user";
import { Player, ControlBar, ForwardControl, ReplayControl } from "video-react";

import {
  HOME_PAGE_POSTS_LIMIT,
  PROFILE_PAGE_POSTS_LIMIT,
} from "constants/DataLimit";

import { useStore } from "store";

import * as Routes from "routes";

import { timeAgo } from "utils/date";

const Root = styled.div`
  width: 100%;
  border-radius: ${(p) => p.theme.radius.sm};
  padding-bottom: ${(p) => p.theme.spacing.xs};
  background-color: ${(p) => p.theme.colors.white};
  border: 1px solid ${(p) => p.theme.colors.border.main};
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.sm};
`;

const CreatedAt = styled.div`
  font-size: ${(p) => p.theme.font.size.xxs};
  color: ${(p) => p.theme.colors.text.hint};
  border-bottom: 1px solid ${(p) => p.theme.colors.text.secondary};
  border: 0;
  margin-top: 2px;
`;

const Author = styled(A)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Name = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.bold};
  color: ${(p) => p.theme.colors.primary.main};
`;

const Poster = styled.img`
  display: block;
  width: 100%;
  max-height: 700px;
  object-fit: cover;
  cursor: pointer;
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

const Title = styled.div`
  word-break: break-word;
  white-space: pre-line;
`;

const BottomRow = styled.div`
  overflow: hidden;
`;

const CountAndIcons = styled.div`
  padding: 0 ${(p) => p.theme.spacing.sm};
`;

const Count = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${(p) => p.theme.spacing.xs};
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.text.secondary};
`;

const Icons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
`;

const Comments = styled.div`
  padding: 0 ${(p) => p.theme.spacing.sm};
  margin: 15px 0px;
`;

const Dropdown = styled.div`
  visibility: hidden;
  height: 0;
  opacity: 0;
  top: 100%;
  transform: translateY(-1em);
  transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s,
    z-index 0s linear 0.01s;

  ${(props) =>
    props.visibility &&
    css`
      visibility: visible; /* shows sub-menu */
      opacity: 1;
      height: auto;
      z-index: 1;
      transform: translateY(0%);
      transition-delay: 0s, 0s, 0.3s;
    `};
`;

const StyledButton = styled(Button)`
  padding: 0;
  padding-left: 4px;
  font-size: ${(p) => p.theme.font.size.xxs};
`;

const CommentLine = styled.div`
  margin-bottom: 5px;
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
`;

const SeeMore = styled.div`
  color: #04aa6d;
  margin-top: 10px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

/**
 * Component for rendering user post
 */
const PostCard = ({
  author,
  imagePublicId,
  comments,
  title,
  createdAt,
  image,
  likes,
  postId,
  openModal,
}) => {
  const [{ auth }] = useStore();
  const client = useApolloClient();
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [lengthComment, setLengthComment] = useState(4);
  const refVideo = useRef(document.createElement("video"));
  const toggleCreateComment = () => {
    setIsCommentOpen(true);
  };

  const toggleComment = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  const closeOption = () => setIsOptionOpen(false);

  const openOption = () => setIsOptionOpen(true);

  const deletePost = async () => {
    try {
      await client.mutate({
        mutation: DELETE_POST,
        variables: { input: { id: postId, imagePublicId } },
        refetchQueries: () => [
          {
            query: GET_FOLLOWED_POSTS,
            variables: {
              userId: auth.user.id,
              skip: 0,
              limit: HOME_PAGE_POSTS_LIMIT,
            },
          },
          { query: GET_AUTH_USER },
          {
            query: GET_USER_POSTS,
            variables: {
              username: auth.user.username,
              skip: 0,
              limit: PROFILE_PAGE_POSTS_LIMIT,
            },
          },
        ],
      });
    } catch (err) {}

    setIsOptionOpen(false);
  };

  const checkURL = (url) => {
    if (url) return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    return false;
  };

  const handleScroll = () => {
    if(refVideo.current) {
      refVideo.current.contentWindow.postMessage(
        JSON.stringify({
          action: 'stop-video',
          parentScrollTop: window.pageYOffset || document.documentElement.scrollTop,
          parentInnerHeight: window.innerHeight,
        }),
        '*',
      );
    }
  };

  return (
    <>
      <Root>
        <Modal onClose={closeOption} open={isOptionOpen}>
          <PostCardOption
            postId={postId}
            closeOption={closeOption}
            author={author}
            deletePost={deletePost}
          />
        </Modal>

        <TopRow>
          <Author
            to={generatePath(Routes.USER_PROFILE, {
              username: author.username,
            })}
          >
            <Avatar image={author.image} />

            <Spacing left="xs">
              <Name>{author.fullName}</Name>
              <CreatedAt>{timeAgo(createdAt)}</CreatedAt>
            </Spacing>
          </Author>

          <Button ghost onClick={openOption}>
            <DotsIcon />
          </Button>
        </TopRow>

        <Spacing left="sm" bottom="sm" top="xs" right="sm">
          <Title>
            <H3>{title}</H3>
          </Title>
        </Spacing>

        {checkURL(image) && <Poster src={image} onClick={openModal} />}

        {!checkURL(image) && image && (
          <div style={{ margin: "10px 0px 20px" }}>
            <Player
              playsInline
              ref={refVideo}
              poster="https://datatrue.com/assets/video-thumbnail-d220a7bec33b382b21617fdddbe82f2c6491b46574f427454412b6d093d111d5.png"
              src={image}
            >
              <ControlBar autoHide={false}>
                <ReplayControl seconds={10} order={2.2} />

                <ForwardControl seconds={10} order={3.2} />
              </ControlBar>
            </Player>
          </div>
        )}

        <BottomRow>
          <CountAndIcons>
            <Count>
              {likes.length} likes
              <Spacing />
              <StyledButton onClick={toggleComment} text>
                {comments.length} comments
              </StyledButton>
            </Count>

            <Icons>
              <Like
                fullWidth
                withText
                user={author}
                postId={postId}
                likes={likes}
              />

              <Button fullWidth text onClick={toggleCreateComment}>
                <PostCommentIcon /> <Spacing inline left="xxs" /> <b>Comment</b>
              </Button>
            </Icons>
          </CountAndIcons>

          <Dropdown visibility={isCommentOpen}>
            <Comments>
              {comments.map((comment, index) => {
                if (index > lengthComment - 1) return <></>;
                return (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                    postAuthor={author}
                  />
                );
              })}
              {comments.length > lengthComment && (
                <SeeMore
                  onClick={() => {
                    setLengthComment(lengthComment + 4);
                  }}
                >
                  View more comments
                </SeeMore>
              )}
            </Comments>
            {/* {comments.length > 0 && <CommentLine />} */}
            <Spacing top="xs">
              <CommentLine />
              <CreateComment post={{ id: postId, author }} focus={false} />
            </Spacing>
          </Dropdown>
        </BottomRow>
      </Root>
    </>
  );
};

PostCard.propTypes = {
  author: PropTypes.object.isRequired,
  imagePublicId: PropTypes.string,
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  likes: PropTypes.array.isRequired,
  comments: PropTypes.array,
  createdAt: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default PostCard;
