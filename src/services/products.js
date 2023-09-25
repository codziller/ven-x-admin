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
categories {
  name
  id
  }
costPrice
createdAt
discountType
discountValue
enablePreOrder
howToUse
id
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
ribbon
salePrice
updatedAt
weight
imageUrls
warehouseInventory {
id
lowInQuantityValue
quantity
warehouseId
}
archive
       
    }
  }
`;
const getProductCostPriceHistoryQuery = ({ id }) => gql`
  {
    __typename
    product(id: "${id}") {
   id 
   name
   productCostPriceHistory {
    createdAt
    newCostPrice
    oldCostPrice
   }
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

const checkProductQuantityInWarehouseQuery = ({
  productId,
  requiredQuantity,
  warehouseId,
}) => gql`
{
  __typename
  checkProductQuantityInWarehouse(productId: "${productId}", requiredQuantity: ${requiredQuantity}, warehouseId: "${warehouseId}") {    
  scalar
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
      categories {
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
    $categoryIds: [String!]!
    $costPrice: String!
    $discountType: DISCOUNT_TYPE
    $discountValue: String
    $enablePreOrder: Boolean!
    $howToUse: String
    $imageUrls: [String!]
    $name: String!
    $preOrderLimit: String!
    $preOrderMessage: String
    $productDescription: String
    $productIngredients: String
    $productOptions: [CreateProductOptionInput!]
    $productSubscriptions: [CreateProductSubscriptionInput!]
    $productVariants: [CreateProductVariantInput!]
    $warehouseInventory: [WareHouseInventoryInput!]!
    $ribbon: RIBBON
    $salePrice: String!
    $videoUrls: [String!]
    $weight: String!
  ) {
    createProduct(
      createProductInput: {
        brandId: $brandId
        categoryIds: $categoryIds
        costPrice: $costPrice
        discountType: $discountType
        discountValue: $discountValue
        enablePreOrder: $enablePreOrder
        howToUse: $howToUse
        imageUrls: $imageUrls
        name: $name
        preOrderLimit: $preOrderLimit
        preOrderMessage: $preOrderMessage
        productDescription: $productDescription
        productIngredients: $productIngredients
        productOptions: $productOptions
        productSubscriptions: $productSubscriptions
        productVariants: $productVariants
        warehouseInventory: $warehouseInventory
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
    $categoryIds: [String!]!
    $costPrice: String!
    $discountType: DISCOUNT_TYPE
    $discountValue: String
    $enablePreOrder: Boolean!
    $howToUse: String
    $imageUrls: [String!]
    $name: String!
    $preOrderLimit: String!
    $preOrderMessage: String
    $productDescription: String
    $productIngredients: String
    $ribbon: RIBBON
    $salePrice: String!
    $videoUrls: [String!]
    $weight: String!
  ) {
    updateProduct(
      updateProductInput: {
        brandId: $brandId
        categoryIds: $categoryIds
        costPrice: $costPrice
        discountType: $discountType
        discountValue: $discountValue
        enablePreOrder: $enablePreOrder
        howToUse: $howToUse
        imageUrls: $imageUrls
        name: $name
        preOrderLimit: $preOrderLimit
        preOrderMessage: $preOrderMessage
        productDescription: $productDescription
        productIngredients: $productIngredients
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
const editProductInventoryQuery = gql`
  mutation updateProductInventory(
    $lowInQuantityValue: String!
    $productId: String!
    $quantity: String!
    $warehouseId: String!
  ) {
    updateProductInventory(
      lowInQuantityValue: $lowInQuantityValue
      productId: $productId
      quantity: $quantity
      warehouseId: $warehouseId
    ) {
      status
    }
  }
`;
const requestProductsQuery = gql`
  mutation requestProducts(
    $destinationWarehouseId: String!
    $productTransferRequestProductQuantities: [CreateProductTransferRequestProductQuantityInput!]!
    $sourceWarehouseId: String!
  ) {
    requestProducts(
      createProductTransferRequestInput: {
        destinationWarehouseId: $destinationWarehouseId
        productTransferRequestProductQuantities: $productTransferRequestProductQuantities
        sourceWarehouseId: $sourceWarehouseId
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
        categories {
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

const productTransferRequestQuery = ({ id }) => gql`
  {
    __typename
    productTransferRequest(id: ${id}) {
      acceptedBy {
        firstName
        lastName
        id
      }
      cancelledBy {
        firstName
        lastName
        id
      }
      cancelledTime
      code
      completedBy {
        firstName
        lastName
        id
      }
      completedTime
      createdAt
      startTime
      status
      createdBy {
        firstName
        lastName
        id
      }
      destinationWarehouse {
        id
        name
      }
      sourceWarehouse {
        id
        name
      }
      id
      productTransferRequestProductQuantities {
        quantity
        product{
          name
        }
        
      }
    }
  }
`;
const productTransferRequestsQuery = ({
  page,
  warehouseId,
  isSource,
  status,
}) => gql`
  {
    __typename
    productTransferRequests(isSource: ${isSource}, pageNumber: "${page}", status: ${status}, warehouseId: "${warehouseId}") {
      total
      results {
        acceptedBy {
          firstName
          lastName
          id
        }
        cancelledBy {
          firstName
          lastName
          id
        }
        cancelledTime
        code
        completedBy {
          firstName
          lastName
          id
        }
        completedTime
        createdAt
        startTime
        status
        createdBy {
          firstName
          lastName
          id
        }
        destinationWarehouse {
          id
          name
        }
        sourceWarehouse {
          id
          name
        }
        id
        productTransferRequestProductQuantities {
          quantity
          product {
            name
          }
          
        }
      }
    }
  }
`;

const updateProductTransferRequestStatusQuery = gql`
  mutation updateProductTransferRequestStatus(
    $productTransferRequestId: String!
    $status: TRANSFER_REQUEST_STATUS!
    $warehouseId: String!
  ) {
    updateProductTransferRequestStatus(
      productTransferRequestId: $productTransferRequestId
      status: $status
      warehouseId: $warehouseId
    ) {
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
  getProductCostPriceHistory: ({ id }) =>
    graphQlInstance(getProductCostPriceHistoryQuery({ id }), {
      method: "GET",
    }),

  getProductName: ({ id }) =>
    graphQlInstance(getProductNameQuery({ id }), {
      method: "GET",
    }),
  checkProductQuantityInWarehouse: ({ id }) =>
    graphQlInstance(checkProductQuantityInWarehouseQuery({ id }), {
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
  editProductInventory: (variables) =>
    graphQlInstance(editProductInventoryQuery, {
      variables,
    }),

  requestProducts: (variables) =>
    graphQlInstance(requestProductsQuery, {
      variables,
    }),

  searchProducts: ({ page, searchQuery }) =>
    graphQlInstance(searchProductsQuery({ page, searchQuery }), {
      method: "GET",
    }),

  productTransferRequests: ({ page, warehouseId, status, isSource }) =>
    graphQlInstance(
      productTransferRequestsQuery({ page, warehouseId, status, isSource }),
      {
        method: "GET",
      }
    ),
  productTransferRequest: ({ id }) =>
    graphQlInstance(productTransferRequestQuery({ id }), {
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
  updateProductTransferRequestStatus: (variables) =>
    graphQlInstance(updateProductTransferRequestStatusQuery, {
      variables,
    }),
};

export default apis;
