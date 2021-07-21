import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Spacing } from "components/common";
import { UploadImageIcon } from "components/icons";
import { AiOutlineVideoCamera } from "react-icons/ai";
const Input = styled.input`
  display: none;
`;

const Label = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  padding: 9px 14px;
  cursor: pointer;
  transition: background-color 0.1s;
  font-weight: ${(p) => p.theme.font.weight.bold};
  border-radius: ${(p) => p.theme.radius.lg};
  background-color: ${(p) => p.theme.colors.grey[200]};
  font-size: ${(p) => p.theme.font.size.xxs};

  &:hover {
    background-color: ${(p) => p.theme.colors.grey[300]};
  }
`;

/**
 * Component for uploading post image
 */
const PostVideoUpload = ({ handleChange, label }) => (
  <>
    <Input
      name="image"
      onChange={handleChange}
      type="file"
      id="post-video"
      accept="video/mp4,video/x-m4v,video/*"
    />

    <Label htmlFor="post-video">
      <AiOutlineVideoCamera size={20}/>

      {label && <Spacing left="xs">{label}</Spacing>}
    </Label>
  </>
);

PostVideoUpload.propTypes = {
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default PostVideoUpload;
