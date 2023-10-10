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
        imageUrls
        categoryId
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
    brand(id: "${id}") {
      brandDescription
        brandLogoUrl
        brandName
        brandShortText
        createdAt
        id
        updatedAt
        imageUrls
        category {
          name
          id
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
  mutation updateBrand(
    $id: String!
    $brandDescription: String
    $brandLogoUrl: String
    $brandName: String
    $brandShortText: String
    $categoryId: String
    $imageUrls: [String!]
    $videoUrls: [String!]
  ) {
    updateBrand(
      updateBrandInput: {
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

const deleteBrandQuery = gql`
  mutation removeBrand($id: String!) {
    removeBrand(id: $id) {
      status
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

  deleteBrand: (variables) =>
    graphQlInstance(deleteBrandQuery, {
      variables,
    }),
};

export default apis;
