import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getProductsQuery = ({ page }) => gql`
  {
    __typename
    products(pageNumber: "${page}") {
      total
      results {
brand {
  brandName
}
brandId
category {
  name
  }
categoryId
costPrice
createdAt
discountType
discountValue
enablePreOrder
howToUse
id
lowInQuantityValue
name
preOrderLimit
preOrderMessage
productDescription
productIngredients
productOptions {
  name
}
productSubscriptions {
  name
}
quantity
ribbon
salePrice
updatedAt
weight
imageUrls
      }
    }
  }
`;

const getWarehouseQuery = ({ id }) => gql`
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

const createProductQuery = gql`
  mutation createProduct(
    $brandId: String!
    $categoryId: String!
    $costPrice: String!
    $discountType: DiscountType
    $discountValue: String
    $enablePreOrder: Boolean!
    $howToUse: String
    $imageUrls: [String!]
    $lowInQuantityValue: String!
    $name: String!
    $preOrderLimit: String!
    $preOrderMessage: String
    $productDescription: String
    $productIngredients: String
    $productOptions: [CreateProductOptionInput!]
    $productSubscriptions: [CreateProductSubscriptionInput!]
    $productVariant: CreateProductVariantInput
    $quantity: String!
    $ribbon: RIBBON
    $salePrice: String!
    $videoUrls: [String!]
    $weight: String!
  ) {
    createProduct(
      createProductInput: {
        brandId: $brandId
        categoryId: $categoryId
        costPrice: $costPrice
        discountType: $discountType
        discountValue: $discountValue
        enablePreOrder: $enablePreOrder
        howToUse: $howToUse
        imageUrls: $imageUrls
        lowInQuantityValue: $lowInQuantityValue
        name: $name
        preOrderLimit: $preOrderLimit
        preOrderMessage: $preOrderMessage
        productDescription: $productDescription
        productIngredients: $productIngredients
        productOptions: $productOptions
        productSubscriptions: $productSubscriptions
        productVariant: $productVariant
        quantity: $quantity
        ribbon: $ribbon
        salePrice: $salePrice
        videoUrls: $videoUrls
        weight: $weight
      }
    ) {
      id
    }
  }
`;

const editWarehouseQuery = gql`
  mutation updateWarehouse(
    $name: String!
    $country: String!
    $state: String!
    $id: String!
  ) {
    updateWarehouse(
      updateWarehouseDto: {
        name: $name
        country: $country
        state: $state
        id: $id
      }
    ) {
      name
      country
      state
      id
    }
  }
`;

const apis = {
  getProducts: ({ page }) =>
    graphQlInstance(getProductsQuery({ page }), {
      method: "GET",
    }),
  getWarehouse: ({ id }) =>
    graphQlInstance(getWarehouseQuery({ id }), {
      method: "GET",
    }),

  createProduct: (variables) =>
    graphQlInstance(createProductQuery, {
      variables,
    }),

  editWarehouse: (variables) =>
    graphQlInstance(editWarehouseQuery, {
      variables,
    }),

  // deleteItem: (variables) =>
  //   graphQlInstance(deleteItemQuery, {
  //     variables,
  //   }),
};

export default apis;
