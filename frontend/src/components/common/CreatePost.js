import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import styled from "styled-components";
import "video-react/dist/video-react.css"; // import css
import { Player } from "video-react";
import {
  Spacing,
  Overlay,
  Container,
  Error,
  Button,
  Avatar,
  Modal,
} from "components/common";

import PostImageUpload from "pages/Home/PostImageUpload";
import { CloseIcon } from "components/icons";

import { GET_FOLLOWED_POSTS, CREATE_POST } from "graphql/post";
import { GET_AUTH_USER, GET_USER_POSTS } from "graphql/user";

import { useStore } from "store";

import { PROFILE_PAGE_POSTS_LIMIT } from "constants/DataLimit";
import { HOME_PAGE_POSTS_LIMIT } from "constants/DataLimit";
import { MAX_POST_IMAGE_SIZE } from "constants/ImageSize";

import { useGlobalMessage } from "hooks/useGlobalMessage";
import PostVideoUpload from "pages/Home/PostVideoUpload";

const Root = styled((props) => <Container {...props} />)`
  border: 0;
  border: 1px solid ${(p) => p.theme.colors.border.main};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing.sm} 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  margin: 0 ${(p) => p.theme.spacing.xs};
  padding-left: ${(p) => p.theme.spacing.sm};
  padding-top: ${(p) => p.theme.spacing.xs};
  border: 0;
  outline: none;
  resize: none;
  transition: 0.1s ease-out;
  height: ${(p) => (p.focus ? "150px" : "40px")};
  font-size: ${(p) => p.theme.font.size.xs};
  background-color: ${(p) => p.theme.colors.grey[200]};
  border-radius: ${(p) => p.theme.radius.md};
`;

const ImagePreviewContainer = styled.div`
  width: 150px;
  height: 150px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: ${(p) => p.theme.shadows.sm};
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
  padding: ${(p) => p.theme.spacing.sm} 0;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContainerModal = styled.div`
  background-color: #fff;
  padding: 20px 40px;
  @media (min-width: ${(p) => p.theme.screen.md}) {
    width: 600px;
  }

  @media (min-width: ${(p) => parseInt(p.theme.screen.lg, 10) + 20 + "px"}) {
    width: 800px;
  }
`;
const DeleteButton = styled.button`
  cursor: pointer;
  background-color: #aaa;
  border: 0;
  outline: 0;
  margin-left: 20px;
  border-radius: 10px;
`;
/**
 * Component for creating a post
 */
export const CreatePost = () => {
  const [{ auth }] = useStore();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState(false);
  const message = useGlobalMessage();
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    refetchQueries: [
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

  const handleReset = () => {
    setTitle("");
    setImage("");
    setIsFocused(false);
    setError("");
    setVideo("");
    setApiError(false);
  };

  const handlePostVideoUpload = (e) => {
    const file = e.target.files[0];
    console.log("change", file);
    if (!file) return;

    setVideo(file);

    setIsFocused(true);
    e.target.value = null;
  };

  const handlePostImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size >= MAX_POST_IMAGE_SIZE) {
      message.error(
        `File size should be less then ${MAX_POST_IMAGE_SIZE / 1000000}MB`
      );
      return;
    }

    setImage(file);

    setIsFocused(true);
    e.target.value = null;
  };

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fileUpload = image || video;
      await createPost({
        variables: {
          input: { title, image: fileUpload, authorId: auth.user.id },
        },
      });
      handleReset();
    } catch (error) {
      setApiError(true);
    }
  };

  const isShareDisabled = loading || (!loading && !image && !title);

  return (
    <>
      {/* {isFocused && <Overlay onClick={handleReset} />} */}

      <Root
        color="white"
        radius="sm"
        padding="sm"
        zIndex={isFocused ? "md" : "xs"}
      >
        <Wrapper>
          <Avatar image={auth.user.image} size={40} />

          <Textarea
            onClick={() => {
              setIsFocused(true);
            }}
            placeholder="Add a post"
          />

          {!isFocused && (
            <PostImageUpload handleChange={handlePostImageUpload} />
          )}
        </Wrapper>
      </Root>
      <Modal open={isFocused} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <ContainerModal>
            <Wrapper>
              <Avatar image={auth.user.image} size={40} />

              <Textarea
                type="textarea"
                name="title"
                focus={isFocused}
                value={title}
                onChange={handleTitleChange}
                placeholder="Add a post"
              />

              {!isFocused && (
                <PostImageUpload handleChange={handlePostImageUpload} />
              )}
            </Wrapper>

            {image && (
              <Spacing bottom="sm">
                <ImagePreviewContainer>
                  <ImagePreview src={URL.createObjectURL(image)} />
                </ImagePreviewContainer>
              </Spacing>
            )}
            {video && (
              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  backgroundColor: "#eb5b34",
                  color: "#fff",
                  borderRadius: 20,
                  width: "fit-content",
                  padding: 10,
                }}
              >
                <span>{video.name}</span>
                <DeleteButton
                  onClick={() => {
                    setVideo("");
                  }}
                >
                  <CloseIcon width="10" />
                </DeleteButton>
              </div>
            )}

            {isFocused && (
              <Options>
                <div style={{ display: "flex" }}>
                  <PostImageUpload
                    label="Photo"
                    handleChange={handlePostImageUpload}
                  />
                  <PostVideoUpload
                    label="Video"
                    handleChange={handlePostVideoUpload}
                  />
                </div>

                <Buttons>
                  <Button text type="button" onClick={handleReset}>
                    Cancel
                  </Button>
                  <Button disabled={isShareDisabled} type="submit">
                    Share
                  </Button>
                </Buttons>
              </Options>
            )}

            {apiError ||
              (error && (
                <Spacing top="xs" bottom="sm">
                  <Error size="xs">
                    {apiError
                      ? "Something went wrong, please try again."
                      : error}
                  </Error>
                </Spacing>
              ))}
          </ContainerModal>
        </form>
      </Modal>
    </>
  );
};
