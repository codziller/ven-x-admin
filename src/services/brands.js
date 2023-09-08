import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getBrandsQuery = ({ page }) => gql`
  {
    __typename
    brands(pageNumber: "${page}") {
      total
      results {
        brandDescription
        brandLogoUrl
        brandName
        brandShortText
        createdAt
        id
        updatedAt
        category {
          name
          id
        }
      }
    }
  }
`;

const getBrandQuery = ({ id }) => gql`
  {
    __typename
    barnd(id: "${id}") {
      name
      country
      state
      createdAt
      id
      lat
      lng
      products {
        brandId
      }
    }
  }
`;

const createBrandQuery = gql`
  mutation createBrand(
    $brandDescription: String!
    $brandLogoUrl: String!
    $brandName: String!
    $brandShortText: String!
    $categoryId: String
    $imageUrls: [String!]
    $videoUrls: [String!]
  ) {
    createBrand(
      createBrandInput: {
        brandDescription: $brandDescription
        brandLogoUrl: $brandLogoUrl
        brandName: $brandName
        brandShortText: $brandShortText
        categoryId: $categoryId
        imageUrls: $imageUrls
        videoUrls: $videoUrls
      }
    ) {
      id
    }
  }
`;

const editBrandQuery = gql`
  mutation createBrand(
    $id: String!
    $brandDescription: String
    $brandLogoUrl: String
    $brandName: String
    $brandShortText: String
    $categoryId: String
    $imageUrls: [String!]
    $videoUrls: [String!]
  ) {
    createBrand(
      createBrandInput: {
        id: $id
        brandDescription: $brandDescription
        brandLogoUrl: $brandLogoUrl
        brandName: $brandName
        brandShortText: $brandShortText
        categoryId: $categoryId
        imageUrls: $imageUrls
        videoUrls: $videoUrls
      }
    ) {
      id
    }
  }
`;

const apis = {
  getBrands: ({ page }) =>
    graphQlInstance(getBrandsQuery({ page }), {
      method: "GET",
    }),
  getBrand: ({ id }) =>
    graphQlInstance(getBrandQuery({ id }), {
      method: "GET",
    }),

  createBrand: (variables) =>
    graphQlInstance(createBrandQuery, {
      variables,
    }),

  editBrand: (variables) =>
    graphQlInstance(editBrandQuery, {
      variables,
    }),

  // deleteItem: (variables) =>
  //   graphQlInstance(deleteItemQuery, {
  //     variables,
  //   }),
};

export default apis;
