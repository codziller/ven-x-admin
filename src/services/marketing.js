import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getWebMarketingImagesQuery = ({ page }) => gql`
  {
    __typename
    webMarketingImages(pageNumber: "${page}") {
      total
      results {
        dataId
        headerNavId
        id
        imageUrl
        isForYou
        landscapeImageUrl
        pageToLinkTo
        updatedAt
      }
    }
  }
`;

const getWebMarketingImageQuery = ({ id }) => gql`
  {
    __typename
    webMarketingImage(id: "${id}") {
      dataId
        headerNavId
        id
        imageUrl
        isForYou
        landscapeImageUrl
        pageToLinkTo
        updatedAt
    }
  }
`;

const getMobileBrandsOfTheMomentsQuery = ({ page }) => gql`
  {
    __typename
    mobileBrandsOfTheMoments(pageNumber: "${page}") {
      total
      results {
        dataId
        headerNavId
        id
        imageUrl
        isForYou
        pageToLinkTo
        subText
        titleText
        updatedAt
      }
    }
  }
`;

const getMobileBrandsOfTheMomentQuery = ({ id }) => gql`
  {
    __typename
    mobileBrandsOfTheMoment(id: "${id}") {
      dataId
      headerNavId
      id
      imageUrl
      isForYou
      pageToLinkTo
      subText
      titleText
      updatedAt
    }
  }
`;

const getMobileMarketingImagesQuery = ({ page }) => gql`
  {
    __typename
    mobileMarketingImages(pageNumber: "${page}") {
      total
      results {
        archive
        headerNavId
        updatedAt
        id
        imageUrl
        isForYou
      }
    }
  }
`;

const getMobileMarketingImageQuery = ({ id }) => gql`
  {
    __typename
    mobileMarketingImage(id: "${id}") {
        archive
        headerNavId
        updatedAt
        id
        imageUrl
        isForYou
        pageToLinkTo
        dataId
    }
  }
`;

const getPromoBannersQuery = ({ page }) => gql`
  {
    __typename
    promoBanners {
      id
      showOnMobile
      showOnWeb
      titleText
    }
  }
`;

const getPromoBannerQuery = ({ id }) => gql`
  {
    __typename
    promoBanner(id: "${id}") {
      id
      showOnMobile
      showOnWeb
      titleText
    }
  }
`;

const getDiscountsQuery = ({ page }) => gql`
  {
    __typename
    discounts(pageNumber: "${page}") {
      total
      results {
        id
        imageUrl
        showOnMobile
        showOnWeb 
        titleText
        discountCode
      }
    }
  }
`;

const getDiscountQuery = ({ id }) => gql`
  {
    __typename
    discount(id: "${id}") {
        archived
        descriptionText
        discountCode
        discountType
        discountValue
        id
        imageUrl
        showOnMobile
        showOnWeb
        titleText
    }
  }
`;

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
        dataId
        id
        pageToLinkTo
        imageUrl
        position
    }
  }
`;

const createWebMarketingImageQuery = gql`
  mutation createWebMarketingImage(
    $dataId: String
    $headerNavId: String
    $imageUrl: String!
    $isForYou: Boolean!
    $landscapeImageUrl: String!
    $pageToLinkTo: PageToLinkToEnum
  ) {
    createWebMarketingImage(
      createWebMarketingImageInput: {
        dataId: $dataId
        headerNavId: $headerNavId
        imageUrl: $imageUrl
        isForYou: $isForYou
        pageToLinkTo: $pageToLinkTo
        landscapeImageUrl: $landscapeImageUrl
      }
    ) {
      id
    }
  }
`;

const editWebMarketingImageQuery = gql`
  mutation updateWebMarketingImage(
    $dataId: String
    $headerNavId: String
    $imageUrl: String!
    $isForYou: Boolean!
    $landscapeImageUrl: String!
    $pageToLinkTo: PageToLinkToEnum
    $id: String!
  ) {
    updateWebMarketingImage(
      updateWebMarketingImageInput: {
        dataId: $dataId
        headerNavId: $headerNavId
        imageUrl: $imageUrl
        isForYou: $isForYou
        pageToLinkTo: $pageToLinkTo
        landscapeImageUrl: $landscapeImageUrl
        id: $id
      }
    ) {
      id
    }
  }
`;

const createMobileBrandsOfTheMomentQuery = gql`
  mutation createMobileBrandsOfTheMoment(
    $dataId: String
    $headerNavId: String
    $imageUrl: String!
    $isForYou: Boolean!
    $pageToLinkTo: PageToLinkToEnum
    $subText: String!
    $titleText: String!
  ) {
    createMobileBrandsOfTheMoment(
      createMobileBrandsOfTheMomentInput: {
        dataId: $dataId
        headerNavId: $headerNavId
        imageUrl: $imageUrl
        isForYou: $isForYou
        pageToLinkTo: $pageToLinkTo
        subText: $subText
        titleText: $titleText
      }
    ) {
      id
    }
  }
`;

const editMobileBrandsOfTheMomentQuery = gql`
  mutation updateMobileBrandsOfTheMoment(
    $dataId: String
    $headerNavId: String
    $imageUrl: String!
    $isForYou: Boolean!
    $pageToLinkTo: PageToLinkToEnum
    $subText: String!
    $titleText: String!
    $id: String!
  ) {
    updateMobileBrandsOfTheMoment(
      updateMobileBrandsOfTheMomentInput: {
        dataId: $dataId
        headerNavId: $headerNavId
        imageUrl: $imageUrl
        isForYou: $isForYou
        pageToLinkTo: $pageToLinkTo
        subText: $subText
        titleText: $titleText
        id: $id
      }
    ) {
      id
    }
  }
`;

const createMobileMarketingImageQuery = gql`
  mutation createMobileMarketingImage(
    $headerNavId: String
    $imageUrl: String!
    $isForYou: Boolean!
    $dataId: String
    $pageToLinkTo: PageToLinkToEnum
  ) {
    createMobileMarketingImage(
      createMobileMarketingImageInput: {
        headerNavId: $headerNavId
        imageUrl: $imageUrl
        isForYou: $isForYou
        dataId: $dataId
        pageToLinkTo: $pageToLinkTo
      }
    ) {
      id
    }
  }
`;

const editMobileMarketingImageQuery = gql`
  mutation updateMobileMarketingImage(
    $headerNavId: String
    $imageUrl: String
    $isForYou: Boolean
    $dataId: String
    $pageToLinkTo: PageToLinkToEnum
    $id: String!
  ) {
    updateMobileMarketingImage(
      updateMobileMarketingImageInput: {
        headerNavId: $headerNavId
        imageUrl: $imageUrl
        isForYou: $isForYou
        dataId: $dataId
        pageToLinkTo: $pageToLinkTo
        id: $id
      }
    ) {
      id
    }
  }
`;

const createPromoBannerQuery = gql`
  mutation createPromoBanner(
    $showOnMobile: Boolean!
    $showOnWeb: Boolean!
    $titleText: String!
  ) {
    createPromoBanner(
      createPromoBannerInput: {
        showOnMobile: $showOnMobile
        showOnWeb: $showOnWeb
        titleText: $titleText
      }
    ) {
      id
    }
  }
`;

const editPromoBannerQuery = gql`
  mutation updatePromoBanner(
    $showOnMobile: Boolean
    $showOnWeb: Boolean
    $titleText: String
    $id: String!
  ) {
    updatePromoBanner(
      updatePromoBannerInput: {
        showOnMobile: $showOnMobile
        showOnWeb: $showOnWeb
        titleText: $titleText
        id: $id
      }
    ) {
      id
    }
  }
`;

const createDiscountQuery = gql`
  mutation createDiscount(
    $brandIds: [String!]
    $categoryIds: [String!]
    $discountBuyXValue: Int
    $discountCode: String!
    $discountGetXValue: Int
    $discountGetYProductId: String
    $discountGetYValue: Int
    $discountType: DISCOUNT_TYPE!
    $discountValue: String!
    $name: String!
    $productIds: [String!]
  ) {
    createDiscount(
      createDiscountInput: {
        brandIds: $brandIds
        categoryIds: $categoryIds
        discountBuyXValue: $discountBuyXValue
        discountCode: $discountCode
        discountGetXValue: $discountGetXValue
        discountGetYProductId: $discountGetYProductId
        discountGetYValue: $discountGetYValue
        discountType: $discountType
        discountValue: $discountValue
        name: $name
        productIds: $productIds
      }
    ) {
      id
    }
  }
`;

const editDiscountQuery = gql`
  mutation updateDiscount(
    $brandIds: [String!]
    $categoryIds: [String!]
    $discountBuyXValue: Int
    $discountCode: String!
    $discountGetXValue: Int
    $discountGetYProductId: String
    $discountGetYValue: Int
    $discountType: DISCOUNT_TYPE!
    $discountValue: String!
    $name: String!
    $productIds: [String!]
    $id: String!
  ) {
    updateDiscount(
      updateDiscountInput: {
        brandIds: $brandIds
        categoryIds: $categoryIds
        discountBuyXValue: $discountBuyXValue
        discountCode: $discountCode
        discountGetXValue: $discountGetXValue
        discountGetYProductId: $discountGetYProductId
        discountGetYValue: $discountGetYValue
        discountType: $discountType
        discountValue: $discountValue
        name: $name
        productIds: $productIds
        id: $id
      }
    ) {
      id
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
    $pageToLinkTo: PageToLinkToEnum!
    $imageUrl: String!
    $position: String
  ) {
    createMobilePagePost(
      createMobilePagePostDto: {
        dataId: $dataI
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
  getWebMarketingImages: ({ page }) =>
    graphQlInstance(getWebMarketingImagesQuery({ page }), {
      method: "GET",
    }),

  getWebMarketingImage: ({ id }) =>
    graphQlInstance(getWebMarketingImageQuery({ id }), {
      method: "GET",
    }),

  getMobileBrandsOfTheMoments: ({ page }) =>
    graphQlInstance(getMobileBrandsOfTheMomentsQuery({ page }), {
      method: "GET",
    }),

  getMobileBrandsOfTheMoment: ({ id }) =>
    graphQlInstance(getMobileBrandsOfTheMomentQuery({ id }), {
      method: "GET",
    }),

  getMobileMarketingImages: ({ page }) =>
    graphQlInstance(getMobileMarketingImagesQuery({ page }), {
      method: "GET",
    }),

  getMobileMarketingImage: ({ id }) =>
    graphQlInstance(getMobileMarketingImageQuery({ id }), {
      method: "GET",
    }),

  getPromoBanners: ({ page }) =>
    graphQlInstance(getPromoBannersQuery({ page }), {
      method: "GET",
    }),
  getPromoBanner: ({ id }) =>
    graphQlInstance(getPromoBannerQuery({ id }), {
      method: "GET",
    }),

  getDiscounts: ({ page }) =>
    graphQlInstance(getDiscountsQuery({ page }), {
      method: "GET",
    }),
  getDiscount: ({ id }) =>
    graphQlInstance(getDiscountQuery({ id }), {
      method: "GET",
    }),

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

  createWebMarketingImage: (variables) =>
    graphQlInstance(createWebMarketingImageQuery, {
      variables,
    }),

  editWebMarketingImage: (variables) =>
    graphQlInstance(editWebMarketingImageQuery, {
      variables,
    }),

  createMobileBrandsOfTheMoment: (variables) =>
    graphQlInstance(createMobileBrandsOfTheMomentQuery, {
      variables,
    }),

  editMobileBrandsOfTheMoment: (variables) =>
    graphQlInstance(editMobileBrandsOfTheMomentQuery, {
      variables,
    }),

  createMobileMarketingImage: (variables) =>
    graphQlInstance(createMobileMarketingImageQuery, {
      variables,
    }),

  editMobileMarketingImage: (variables) =>
    graphQlInstance(editMobileMarketingImageQuery, {
      variables,
    }),

  createPromoBanner: (variables) =>
    graphQlInstance(createPromoBannerQuery, {
      variables,
    }),
  editPromoBanner: (variables) =>
    graphQlInstance(editPromoBannerQuery, {
      variables,
    }),

  createDiscount: (variables) =>
    graphQlInstance(createDiscountQuery, {
      variables,
    }),
  editDiscount: (variables) =>
    graphQlInstance(editDiscountQuery, {
      variables,
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
