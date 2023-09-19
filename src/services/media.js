import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getImagesQuery = ({ page }) => gql`
  {
    __typename
    images(pageNumber: "${page}") {
      total
      results {
        archive
        dataId
        descriptionText
        id
        name
        pageToLinkTo
        sourceImageUrl
        titleText
      }
    }
  }
`;

const getImageQuery = ({ id }) => gql`
  {
    __typename
    image(id: "${id}") {
      archive
      dataId
      descriptionText
      id
      name
      pageToLinkTo
      sourceImageUrl
      titleText
    }
  }
`;

const getHomeSliderImagesQuery = ({ page }) => gql`
  {
    __typename
    homeSliderHomeSliderImages(pageNumber: "${page}") {
      total
      results {
        archive
        dataId
        descriptionText
        id
        pageToLinkTo
        imageUrl
        titleText
        position
      }
    }
  }
`;

const getHomeSliderImageQuery = ({ id }) => gql`
  {
    __typename
    homeSliderHomeSliderImage(id: "${id}") {
        archive
        dataId
        descriptionText
        id
        pageToLinkTo
        imageUrl
        titleText
        position
    }
  }
`;

const getMobilePagePostsQuery = ({ page }) => gql`
  {
    __typename
    homeSliderMobilePagePosts(pageNumber: "${page}") {
      total
      results {
        archive
        categoryId
        dataId
        id
        pageToLinkTo
        imageUrl
        position
      }
    }
  }
`;

const getMobilePagePostQuery = ({ id }) => gql`
  {
    __typename
    homeSliderMobilePagePost(id: "${id}") {
        archive
        categoryId
        dataId
        id
        pageToLinkTo
        imageUrl
        position
    }
  }
`;

const createImageQuery = gql`
  mutation createImage(
    $dataId: String
    $descriptionText: String
    $name: ImageNameEnum!
    $pageToLinkTo: PageToLinkToEnum
    $sourceImageUrl: String!
    $titleText: String
  ) {
    createImage(
      createImageDto: {
        dataId: $dataId
        descriptionText: $descriptionText
        name: $name
        pageToLinkTo: $pageToLinkTo
        sourceImageUrl: $sourceImageUrl
        titleText: $titleText
      }
    ) {
      id
    }
  }
`;

const editImageQuery = gql`
  mutation updateImage(
    $dataId: String
    $descriptionText: String
    $name: ImageNameEnum!
    $pageToLinkTo: PageToLinkToEnum
    $sourceImageUrl: String!
    $titleText: String
    $id: String!
  ) {
    updateImage(
      updateImageDto: {
        dataId: $dataId
        descriptionText: $descriptionText
        name: $name
        pageToLinkTo: $pageToLinkTo
        sourceImageUrl: $sourceImageUrl
        titleText: $titleText
        id: $id
      }
    ) {
      id
    }
  }
`;

const createHomeSliderImageQuery = gql`
  mutation createHomeSliderImage(
    $dataId: String
    $descriptionText: String
    $position: String
    $pageToLinkTo: PageToLinkToEnum!
    $imageUrl: String!
    $titleText: String
  ) {
    createHomeSliderImage(
      createHomeSliderImageDto: {
        dataId: $dataId
        descriptionText: $descriptionText
        position: $position
        pageToLinkTo: $pageToLinkTo
        imageUrl: $imageUrl
        titleText: $titleText
      }
    ) {
      id
    }
  }
`;

const editHomeSliderImageQuery = gql`
  mutation updateHomeSliderImage(
    $dataId: String
    $descriptionText: String
    $position: String
    $pageToLinkTo: PageToLinkToEnum!
    $imageUrl: String!
    $titleText: String
    $homeSliderImageId: String!
  ) {
    updateHomeSliderImage(
      updateHomeSliderImageDto: {
        dataId: $dataId
        descriptionText: $descriptionText
        position: $position
        pageToLinkTo: $pageToLinkTo
        imageUrl: $imageUrl
        titleText: $titleText
        homeSliderImageId: $homeSliderImageId
      }
    ) {
      id
    }
  }
`;

const createMobilePagePostQuery = gql`
  mutation createMobilePagePost(
    $dataId: String!
    $categoryId: String!
    $pageToLinkTo: PageToLinkToEnum!
    $imageUrl: String!
    $position: String
  ) {
    createMobilePagePost(
      createMobilePagePostDto: {
        dataId: $dataId
        categoryId: $categoryId
        pageToLinkTo: $pageToLinkTo
        imageUrl: $imageUrl
        position: $position
      }
    ) {
      id
    }
  }
`;

const editMobilePagePostQuery = gql`
  mutation updateMobilePagePost(
    $dataId: String
    $categoryId: String
    $pageToLinkTo: PageToLinkToEnum
    $imageUrl: String!
    $position: String
    $mobilePagePostId: String!
  ) {
    updateMobilePagePost(
      updateMobilePagePostDto: {
        dataId: $dataId
        categoryId: $categoryId
        pageToLinkTo: $pageToLinkTo
        imageUrl: $imageUrl
        position: $position
        mobilePagePostId: $mobilePagePostId
      }
    ) {
      id
    }
  }
`;

const deleteBrandQuery = gql`
  mutation removeBrand($id: String!) {
    removeBrand(id: $id) {
      status
    }
  }
`;

const apis = {
  getImages: ({ page }) =>
    graphQlInstance(getImagesQuery({ page }), {
      method: "GET",
    }),
  getImage: ({ id }) =>
    graphQlInstance(getImageQuery({ id }), {
      method: "GET",
    }),
  getHomeSliderImages: ({ page }) =>
    graphQlInstance(getHomeSliderImagesQuery({ page }), {
      method: "GET",
    }),
  getHomeSliderImage: ({ id }) =>
    graphQlInstance(getHomeSliderImageQuery({ id }), {
      method: "GET",
    }),
  getMobilePagePosts: ({ page }) =>
    graphQlInstance(getMobilePagePostsQuery({ page }), {
      method: "GET",
    }),
  getMobilePagePost: ({ id }) =>
    graphQlInstance(getMobilePagePostQuery({ id }), {
      method: "GET",
    }),

  createImage: (variables) =>
    graphQlInstance(createImageQuery, {
      variables,
    }),
  editImage: (variables) =>
    graphQlInstance(editImageQuery, {
      variables,
    }),

  createHomeSliderImage: (variables) =>
    graphQlInstance(createHomeSliderImageQuery, {
      variables,
    }),
  editHomeSliderImage: (variables) =>
    graphQlInstance(editHomeSliderImageQuery, {
      variables,
    }),

  createMobilePagePost: (variables) =>
    graphQlInstance(createMobilePagePostQuery, {
      variables,
    }),
  editMobilePagePost: (variables) =>
    graphQlInstance(editMobilePagePostQuery, {
      variables,
    }),

  deleteBrand: (variables) =>
    graphQlInstance(deleteBrandQuery, {
      variables,
    }),
};

export default apis;
