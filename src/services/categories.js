import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getCategoriesQuery = () => gql`
  {
    __typename
    categories {
      id
      createdAt
      name
      parentCategoryId
      position
      subCategories {
        id
        createdAt
        name
        parentCategoryId
        position
        subCategories {
          id
          createdAt
          name
          parentCategoryId
          position
        }
      }
      updatedAt
    }
  }
`;

const getHeaderNavsQuery = () => gql`
  {
    __typename
    headerNavs {
      archive
      categories {
        name
        subCategories {
          name
          id
        }
      }
      id
      name
      createdAt
    }
  }
`;
const getCategoryQuery = ({ id }) => gql`
  {
    __typename
    warehouse(id: "${id}") {
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

const createCategoryQuery = gql`
  mutation createCategory($name: String!, $parentCategoryId: String) {
    createCategory(
      createCategoryInput: { name: $name, parentCategoryId: $parentCategoryId }
    ) {
      name
      parentCategoryId
    }
  }
`;

const createHeaderNavQuery = gql`
  mutation createHeaderNav($name: String!) {
    createHeaderNav(createHeaderNavInput: { name: $name }) {
      name
    }
  }
`;

const editHeaderNavQuery = gql`
  mutation updateHeaderNav($name: String!, $id: String!) {
    updateHeaderNav(updateHeaderNavInput: { name: $name, id: $id }) {
      id
    }
  }
`;
const editCategoryQuery = gql`
  mutation updateCategory(
    $id: String!
    $name: String!
    $parentCategoryId: String
    $headerNavId: String
  ) {
    updateCategory(
      updateCategoryInput: {
        id: $id
        name: $name
        parentCategoryId: $parentCategoryId
        headerNavId: $headerNavId
      }
    ) {
      id
      name
      parentCategoryId
    }
  }
`;

const deleteCategoryQuery = gql`
  mutation removeCategory($id: String!) {
    removeCategory(id: $id) {
      status
    }
  }
`;

const deleteHeaderNavQuery = gql`
  mutation removeHeaderNav($id: String!) {
    removeHeaderNav(id: $id) {
      status
    }
  }
`;

const apis = {
  getCategories: () =>
    graphQlInstance(getCategoriesQuery(), {
      method: "GET",
    }),
  getHeaderNavs: () =>
    graphQlInstance(getHeaderNavsQuery(), {
      method: "GET",
    }),
  getCategory: ({ id }) =>
    graphQlInstance(getCategoryQuery({ id }), {
      method: "GET",
    }),

  createCategory: (variables) =>
    graphQlInstance(createCategoryQuery, {
      variables,
    }),

  editCategory: (variables) =>
    graphQlInstance(editCategoryQuery, {
      variables,
    }),

  deleteCategory: (variables) =>
    graphQlInstance(deleteCategoryQuery, {
      variables,
    }),

  createHeaderNav: (variables) =>
    graphQlInstance(createHeaderNavQuery, {
      variables,
    }),

  editHeaderNav: (variables) =>
    graphQlInstance(editHeaderNavQuery, {
      variables,
    }),

  deleteHeaderNav: (variables) =>
    graphQlInstance(deleteHeaderNavQuery, {
      variables,
    }),
};

export default apis;
