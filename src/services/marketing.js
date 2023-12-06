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

const getWebLinkMarketingImagesQuery = ({ page }) => gql`
  {
    __typename
    webLinkMarketingImages(pageNumber: "${page}") {
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

const getWebLinkMarketingImageQuery = ({ id }) => gql`
  {
    __typename
    webLinkMarketingImage(id: "${id}") {
        archive
        headerNavId
        updatedAt
        id
        imageUrl
        isForYou
        pageToLinkTo
        dataId
        titleText
        descriptionText
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
        archived
        discountBuyXvalue
        discountCode
        discountGetXvalue
        discountGetYProduct {
          name
          id
        }
        discountGetYproductId
        discountGetYvalue
        discountType
        discountValue
        id
        name
        updatedAt
        discountExpiryTime
      }
    }
  }
`;

const getArchivedDiscountsQuery = ({ page }) => gql`
  {
    __typename
    archived_discounts(pageNumber: "${page}") {
      total
      results {
        archived
        discountBuyXvalue
        discountCode
        discountGetXvalue
        discountGetYProduct {
          name
          id
        }
        discountGetYproductId
        discountGetYvalue
        discountType
        discountValue
        id
        name
        updatedAt
      }
    }
  }
`;

const getDiscountQuery = ({ id }) => gql`
  {
    __typename
    discount(id: "${id}") {
      archived
      discountBuyXvalue
      discountCode
      discountGetXvalue
      discountGetYProduct {
        name
        id
      }
      discountGetYproductId
      discountGetYvalue
      discountType
      discountValue
      id
      name
      updatedAt
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

const getMarketingTextQuery = () => gql`
  {
    __typename
    marketingText {
      appOrderDiscountText
      donationDescriptionText
      donationImageUrl
      donationTitleText
      donationUrlToLinkTo
      emailExclusiveText
      freeShippingText
      loyaltyText
      appOrderDiscountTextVisibility
      emailExclusiveTextVisibility
      freeShippingTextVisibility
      loyaltyTextVisibility
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

const createWebLinkMarketingImageQuery = gql`
  mutation createWebLinkMarketingImage(
    $headerNavId: String
    $imageUrl: String!
    $isForYou: Boolean!
    $dataId: String
    $pageToLinkTo: PageToLinkToEnum
    $titleText: String!
    $descriptionText: String!
  ) {
    createWebLinkMarketingImage(
      createWebLinkMarketingImageInput: {
        headerNavId: $headerNavId
        imageUrl: $imageUrl
        isForYou: $isForYou
        dataId: $dataId
        pageToLinkTo: $pageToLinkTo
        titleText: $titleText
        descriptionText: $descriptionText
      }
    ) {
      id
    }
  }
`;

const editWebLinkMarketingImageQuery = gql`
  mutation updateWebLinkMarketingImage(
    $headerNavId: String
    $imageUrl: String
    $isForYou: Boolean
    $dataId: String
    $pageToLinkTo: PageToLinkToEnum
    $titleText: String
    $descriptionText: String
    $id: String!
  ) {
    updateWebLinkMarketingImage(
      updateWebLinkMarketingImageInput: {
        headerNavId: $headerNavId
        imageUrl: $imageUrl
        isForYou: $isForYou
        dataId: $dataId
        pageToLinkTo: $pageToLinkTo
        titleText: $titleText
        descriptionText: $descriptionText
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
    $discountBuyXvalue: Int
    $discountCode: String!
    $discountGetXvalue: Int
    $discountGetYproductId: String
    $discountGetYvalue: Int
    $discountType: DISCOUNT_TYPE!
    $discountValue: String!
    $name: String!
    $discountExpiryTime: DateTime!
    $productIds: [String!]
  ) {
    createDiscount(
      createDiscountInput: {
        brandIds: $brandIds
        categoryIds: $categoryIds
        discountBuyXvalue: $discountBuyXvalue
        discountCode: $discountCode
        discountGetXvalue: $discountGetXvalue
        discountGetYproductId: $discountGetYproductId
        discountGetYvalue: $discountGetYvalue
        discountType: $discountType
        discountValue: $discountValue
        name: $name
        discountExpiryTime: $discountExpiryTime
        productIds: $productIds
      }
    ) {
      id
    }
  }
`;

const editDiscountQuery = gql`
  mutation updateDiscount(
    $discountBuyXvalue: Int
    $discountCode: String!
    $discountGetXvalue: Int
    $discountGetYproductId: String
    $discountGetYvalue: Int
    $discountType: DISCOUNT_TYPE!
    $discountValue: String!
    $name: String!
    $id: String!
  ) {
    updateDiscount(
      updateDiscountInput: {
        discountBuyXvalue: $discountBuyXvalue
        discountCode: $discountCode
        discountGetXvalue: $discountGetXvalue
        discountGetYproductId: $discountGetYproductId
        discountGetYvalue: $discountGetYvalue
        discountType: $discountType
        discountValue: $discountValue
        name: $name
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

const editMarketingTextQuery = gql`
  mutation patchMarketingText(
    $appOrderDiscountText: String
    $donationDescriptionText: String
    $donationImageUrl: String
    $donationTitleText: String
    $donationUrlToLinkTo: String
    $emailExclusiveText: String
    $freeShippingText: String
    $loyaltyText: String
    $appOrderDiscountTextVisibility: Boolean!
    $emailExclusiveTextVisibility: Boolean!
    $freeShippingTextVisibility: Boolean!
    $loyaltyTextVisibility: Boolean!
  ) {
    patchMarketingText(
      marketingTextInput: {
        appOrderDiscountText: $appOrderDiscountText
        donationDescriptionText: $donationDescriptionText
        donationImageUrl: $donationImageUrl
        donationTitleText: $donationTitleText
        donationUrlToLinkTo: $donationUrlToLinkTo
        emailExclusiveText: $emailExclusiveText
        freeShippingText: $freeShippingText
        loyaltyText: $loyaltyText
        appOrderDiscountTextVisibility: $appOrderDiscountTextVisibility
        emailExclusiveTextVisibility: $emailExclusiveTextVisibility
        freeShippingTextVisibility: $freeShippingTextVisibility
        loyaltyTextVisibility: $loyaltyTextVisibility
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

const deleteDiscountQuery = gql`
  mutation removeDiscount($id: String!) {
    removeDiscount(id: $id) {
      status
    }
  }
`;

const deleteHomeSliderImageQuery = gql`
  mutation removeHomeSliderImage($id: String!) {
    removeHomeSliderImage(id: $id) {
      status
    }
  }
`;

const deleteWebMarketingImageQuery = gql`
  mutation removeWebMarketingImage($id: String!) {
    removeWebMarketingImage(id: $id) {
      status
    }
  }
`;

const deleteMobilePagePostQuery = gql`
  mutation removeMobilePagePost($id: String!) {
    removeMobilePagePost(id: $id) {
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

  getWebLinkMarketingImages: ({ page }) =>
    graphQlInstance(getWebLinkMarketingImagesQuery({ page }), {
      method: "GET",
    }),

  getWebLinkMarketingImage: ({ id }) =>
    graphQlInstance(getWebLinkMarketingImageQuery({ id }), {
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

  getArchivedDiscounts: ({ page }) =>
    graphQlInstance(getArchivedDiscountsQuery({ page }), {
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

  getMarketingText: () =>
    graphQlInstance(getMarketingTextQuery(), {
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

  createWebLinkMarketingImage: (variables) =>
    graphQlInstance(createWebLinkMarketingImageQuery, {
      variables,
    }),

  editWebLinkMarketingImage: (variables) =>
    graphQlInstance(editWebLinkMarketingImageQuery, {
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

  editMarketingText: (variables) =>
    graphQlInstance(editMarketingTextQuery, {
      variables,
    }),

  deleteBrand: (variables) =>
    graphQlInstance(deleteBrandQuery, {
      variables,
    }),
  deleteDiscount: (variables) =>
    graphQlInstance(deleteDiscountQuery, {
      variables,
    }),
  deleteHomeSliderImage: (variables) =>
    graphQlInstance(deleteHomeSliderImageQuery, {
      variables,
    }),

  deleteWebMarketingImage: (variables) =>
    graphQlInstance(deleteWebMarketingImageQuery, {
      variables,
    }),

  deleteMobilePagePost: (variables) =>
    graphQlInstance(deleteMobilePagePostQuery, {
      variables,
    }),
};

export default apis;
