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
  choiceDisplay
  choices{
    choice
    name
  }
  name
  id
}
productSubscriptions {
  name
  id
  active
  discountType
  discountValue
  subscriptionDuration
  subscriptionFrequency
  tagline
}
productVariants {
  id
  description
  imageUrls
  variantCostPrice
  variantName
  variantQuantity
  variantSalePrice
  visibility
  weight
}
quantity
ribbon
salePrice
updatedAt
weight
imageUrls
archive
       
    }
  }
`;
const getProductNameQuery = ({ id }) => gql`
  {
    __typename
    product(id: "${id}") {
    id     
    name
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
      lowInQuantityValue
      salePrice
      imageUrls
      archive
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
    $productId: String!
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
        quantity: $quantity
        ribbon: $ribbon
        salePrice: $salePrice
        videoUrls: $videoUrls
        weight: $weight
      }
      productId: $productId
    ) {
      id
    }
  }
`;

const editProductVariantQuery = gql`
  mutation updateProductVariant(
    $description: String
    $imageUrls: [String!]
    $productVariantId: String!
    $variantCostPrice: String
    $variantName: String
    $variantQuantity: String
    $variantSalePrice: String
    $videoUrls: [String!]
    $visibility: Boolean
    $weight: String
  ) {
    updateProductVariant(
      updateProductInput: {
        description: $description
        imageUrls: $imageUrls
        productVariantId: $productVariantId
        variantCostPrice: $variantCostPrice
        variantName: $variantName
        variantQuantity: $variantQuantity
        variantSalePrice: $variantSalePrice
        videoUrls: $videoUrls
        visibility: $visibility
        weight: $weight
      }
    ) {
      id
    }
  }
`;
const editProductOptionQuery = gql`
  mutation updateProductOption(
    $choiceDisplay: String
    $choices: [UpdateProductSubOption!]
    $name: String
    $productOptionId: String!
  ) {
    updateProductOption(
      updateProductInput: {
        choiceDisplay: $choiceDisplay
        choices: $choices
        name: $name
        productOptionId: $productOptionId
      }
    ) {
      id
    }
  }
`;
const editProductSubscriptionQuery = gql`
  mutation updateProductSubscription(
    $active: Boolean
    $discountType: DISCOUNT_TYPE
    $discountValue: String
    $name: String
    $productSubscriptionId: String!
    $subscriptionDuration: String
    $subscriptionFrequency: String
    $tagline: String
  ) {
    updateProductSubscription(
      updateProductInput: {
        active: $active
        discountType: $discountType
        discountValue: $discountValue
        name: $name
        productSubscriptionId: $productSubscriptionId
        subscriptionDuration: $subscriptionDuration
        subscriptionFrequency: $subscriptionFrequency
        tagline: $tagline
      }
    ) {
      id
    }
  }
`;

const getArchivedProductsQuery = ({ page }) => gql`
  {
    __typename
    archived_products(pageNumber: "${page}") {
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
        lowInQuantityValue
        salePrice
        imageUrls
        archive
      }
    }
  }
`;
const searchProductsQuery = ({ page, searchQuery }) => gql`
  {
    __typename
    searchProducts(pageNumber: "${page}", searchQuery: "${searchQuery}") {
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
        lowInQuantityValue
        salePrice
        imageUrls
        archive 
      }
    }
  }
`;
const deleteProductQuery = gql`
  mutation removeProduct($id: String!) {
    removeProduct(id: $id) {
      status
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
  getProduct: ({ id }) =>
    graphQlInstance(getProductQuery({ id }), {
      method: "GET",
    }),
  getProductName: ({ id }) =>
    graphQlInstance(getProductNameQuery({ id }), {
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
  editProductVariant: (variables) =>
    graphQlInstance(editProductVariantQuery, {
      variables,
    }),
  editProductOption: (variables) =>
    graphQlInstance(editProductOptionQuery, {
      variables,
    }),
  editProductSubscription: (variables) =>
    graphQlInstance(editProductSubscriptionQuery, {
      variables,
    }),
  searchProducts: ({ page, searchQuery }) =>
    graphQlInstance(searchProductsQuery({ page, searchQuery }), {
      method: "GET",
    }),
  getArchivedProducts: ({ page }) =>
    graphQlInstance(getArchivedProductsQuery({ page }), {
      method: "GET",
    }),
  deleteProduct: (variables) =>
    graphQlInstance(deleteProductQuery, {
      variables,
    }),
};

export default apis;
