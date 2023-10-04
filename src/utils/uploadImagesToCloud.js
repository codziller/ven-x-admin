import axios from "axios";
import { isEmpty } from "lodash";
const CLOUDINARY_CLOUDNAME = process.env.REACT_APP_CLOUDINARY_CLOUDNAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/";
export const uploadImagesToCloud = async (files) => {
  if (isEmpty(files)) {
    return [];
  }

  const fileInFiles = files?.filter?.((_) => typeof _ === "object");
  if (isEmpty(fileInFiles)) {
    return files;
  }

  console.log("files before upload: ", files);
  let imageUrls = [];
  // Cheking if image is not a file
  // if (typeof files[0] === "string") {
  //   imageUrls = files;
  // } else {
  // Push all the axios request promise into a single array
  const uploaders = files.map((file, index) => {
    // Initial FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("timestamp", (Date.now() / 1000) | 0);

    return axios
      .post(`${CLOUDINARY_URL}${CLOUDINARY_CLOUDNAME}/upload`, formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      })
      .then((response) => {
        const data = response.data;
        const fileURL = data.url; // You should store this URL for future references in your app
        imageUrls = [...imageUrls, { url: fileURL, index }];
      });
  });

  // Once all the files are uploaded
  await axios.all(uploaders).then(() => {
    // ... perform after upload is successful operation
  });
  console.log("imageUrls after upload: ", imageUrls);
  imageUrls = imageUrls
    ?.sort((a, b) => a?.index - b?.index)
    ?.map((_) => _?.url);
  return imageUrls;
};

export const uploadImageToCloud = async (file) => {
  if (!file) return;
  let imageUrl = "";
  if (typeof file === "string") {
    imageUrl = file;
  } else {
    // Initial FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("timestamp", (Date.now() / 1000) | 0);

    await axios
      .post(`${CLOUDINARY_URL}${CLOUDINARY_CLOUDNAME}/upload`, formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      })
      .then((response) => {
        const data = response.data;
        const fileURL = data.url; // You should store this URL for future references in your app
        imageUrl = fileURL;
      });
  }
  return imageUrl;
};
