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

const editCategoryQuery = gql`
  mutation updateCategory(
    $id: String!
    $name: String!
    $parentCategoryId: String
  ) {
    updateCategory(
      updateCategoryInput: {
        id: $id
        name: $name
        parentCategoryId: $parentCategoryId
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

const apis = {
  getCategories: () =>
    graphQlInstance(getCategoriesQuery(), {
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
};

export default apis;
