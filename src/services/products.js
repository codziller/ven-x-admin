import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getProductQuery = ({ id }) => gql`
  {
    __typename
    product(id: "${id}") {
     
id     
brand {
  brandName
  id
}
brandId
category {
  name
  id
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
  id
}
productSubscriptions {
  name
  id
}
productVariants {
  id
  description
  imageUrls
  variantCostPrice
  variantName
  variantQuantity
  variantSalePrice
  videoUrls
  visibility
  weight
}
quantity
ribbon
salePrice
updatedAt
weight
imageUrls
videoUrls
       
    }
  }
`;
const getProductsQuery = ({ page }) => gql`
  {
    __typename
    products(pageNumber: "${page}") {
      total
      results {
brand {
  brandName
}
category {
  name
  }
id
name
quantity
salePrice
imageUrls
      }
    }
  }
`;

const getProductsCountQuery = ({ page }) => gql`
  {
    __typename
    products(pageNumber: "${page}") {
      total
      
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
    $discountType: DISCOUNT_TYPE
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
    $productVariants: [CreateProductVariantInput!]
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
        productVariants: $productVariants
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

const editProductQuery = gql`
  mutation updateProduct(
    $brandId: String!
    $categoryId: String!
    $costPrice: String!
    $discountType: DISCOUNT_TYPE
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
    $productVariants: [CreateProductVariantInput!]
    $quantity: String!
    $ribbon: RIBBON
    $salePrice: String!
    $videoUrls: [String!]
    $weight: String!
  ) {
    updateProduct(
      updateProductInput: {
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
        productVariants: $productVariants
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

const apis = {
  getProducts: ({ page }) =>
    graphQlInstance(getProductsQuery({ page }), {
      method: "GET",
    }),
  getProductsCount: ({ page }) =>
    graphQlInstance(getProductsCountQuery({ page }), {
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

  editProduct: (variables) =>
    graphQlInstance(editProductQuery, {
      variables,
    }),

  getProduct: ({ id }) =>
    graphQlInstance(getProductQuery({ id }), {
      method: "GET",
    }),
};

export default apis;
