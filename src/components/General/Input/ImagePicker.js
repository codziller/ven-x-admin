import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import { isEmpty } from "lodash";
import { useDropzone } from "react-dropzone";

import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Gallery } from "assets/icons/gallery-black.svg";
import { FormErrorMessage } from "../FormErrorMessage";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 1,
  borderRadius: 8,
  borderColor: "#000000",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function ImagePicker({
  handleDrop,
  images,
  label,
  showFormError,
  formError,
  removeImage,
  placeholder = "Drag 'n' drop some images here, or click to select images",
  type = "image",
  ...rest
}) {
  const isError = formError && showFormError;
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        ...(type === "image" && { "image/*": [] }),
        ...(type === "video" && { "video/*": [] }),
      },
      onDrop: handleDrop,
      ...rest,
    });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject || isError ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject, isError]
  );
  return (
    <div className="flex-col justify-start items-start flex w-full">
      <div className="general-input-label mb-2 relative text-[13px] font-bold text-grey-dark">
        {label}
      </div>
      <div
        className=" flex flex-col justify-center items-center cursor-pointer gap-4 w-full min-h-[150px] bg-stone-50 rounded-lg"
        {...getRootProps({ style })}
      >
        <input {...getInputProps()} />
        <Gallery />
        <p className="text-xs text-grey">{placeholder}</p>

        {!isEmpty(images) && (
          <p className="text-xs text-blue-bright">
            {images?.length} {images?.length === 1 ? type : `${type}s`} selected
          </p>
        )}
      </div>

      {!isEmpty(images) && (
        <div className="grid grid-cols-2 gap-10 my-4">
          {type === "video"
            ? images?.map((file, index) => (
                <div key={file?.name} className="image-item w-full h-fit">
                  <div className="flex justify-between items-center">
                    <span className="text-grey text-xs truncate max-w-[calc(100%-30px)]">
                      {file?.name}
                    </span>
                    <button
                      onClick={() => removeImage?.(file)}
                      className="text-red "
                      type="button"
                    >
                      <Close className="current-svg w-[20px]" />
                    </button>
                  </div>
                  <video controls width="400" height="100">
                    <source src={URL.createObjectURL(file)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))
            : images?.map((file, index) => (
                <div key={index} className="image-item w-full h-[150px]">
                  <div className="flex justify-between items-center">
                    <span className="text-grey text-xs truncate max-w-[calc(100%-30px)]">
                      {file?.name}
                    </span>
                    <button
                      onClick={() => removeImage?.(file)}
                      className="text-red "
                      type="button"
                    >
                      <Close className="current-svg w-[20px]" />
                    </button>
                  </div>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Image ${index}`}
                    className="object-cover object-center w-full h-full min-w-full min-h-full"
                  />
                </div>
              ))}
        </div>
      )}

      <div className="min-h-[13px] mb-4">
        {isError && <FormErrorMessage type={formError} />}
      </div>
    </div>
  );
}

ImagePicker.propTypes = {
  images: PropTypes.array,
  handleDrop: PropTypes.func,
  label: PropTypes.string,
  removeImage: PropTypes.func,
  placeholder: PropTypes.string,
  showFormError: PropTypes.bool,
  formError: PropTypes.object,
};
