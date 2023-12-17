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
isDiscountAllowed
enablePreOrder
isPrivate
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
    description
    imageUrls
    variantCostPrice
    variantName
    variantQuantity
    variantSalePrice
    videoUrls
    visibility
    weight
    color
    main
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
ribbon
salePrice
updatedAt
weight
weightType
imageUrls
warehouseInventory {
id
lowInQuantityValue
quantity
warehouseId
}
productCostPrice {
  costPrice
  updatedAt
  id
  quantityLeft
}
archive
       
    }
  }
`;

const getProductQuantitySoldByDateFilterQuery = ({
  productId,
  endDate,
  startDate,
}) => gql`
  {
    __typename
    getProductQuantitySoldByDateFilter(productId: "${productId}",dateFilter:{

      endDate: "${endDate}",
startDate: "${startDate}"
    }) {
      profit
      qtyLeft
      qtySold
}
}
`;

const getProductQuantitySoldByDateFilterByBrandIdQuery = ({
  brandId,
  endDate,
  startDate,
}) => gql`
  {
    __typename
    getProductQuantitySoldByDateFilterByBrandId(brandId: "${brandId}",dateFilter:{

      endDate: "${endDate}",
startDate: "${startDate}"
    }) {
      costPrice
      productName
      profit
      quantityLeft
      quantitySold
      salePrice
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
      warehouseInventory {
        lowInQuantityValue
        quantity
        warehouseId
      }
      salePrice
      imageUrls
      archive
      productCostPrice {
        costPrice
        updatedAt
        id
        quantityLeft
      }
      }
    }
  }
`;

const getPrivateProductsQuery = ({ page, isPrivate }) => gql`
  {
    __typename
    products_by_private_status(pageNumber: "${page}",isPrivate:${isPrivate}) {
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
    
      salePrice
      imageUrls
      archive
      isPrivate
      productCostPrice {
        costPrice
        updatedAt
        id
        quantityLeft
      }
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
    $isDiscountAllowed: Boolean!
    $enablePreOrder: Boolean!
    $isPrivate: Boolean!
    $howToUse: String
    $imageUrls: [String!]
    $name: String!
    $preOrderLimit: String!
    $preOrderMessage: String
    $productDescription: String
    $productIngredients: String
    $productOptions: [CreateProductOptionInput!]
    $productSubscriptions: [CreateProductSubscriptionInput!]
    $warehouseInventory: [WareHouseInventoryInput!]!
    $ribbon: RIBBON
    $salePrice: String!
    $videoUrls: [String!]
    $weight: String!
    $weightType: WEIGHT_TYPE!
  ) {
    createProduct(
      createProductInput: {
        brandId: $brandId
        categoryIds: $categoryIds
        costPrice: $costPrice
        discountType: $discountType
        discountValue: $discountValue
        isDiscountAllowed: $isDiscountAllowed
        enablePreOrder: $enablePreOrder
        isPrivate: $isPrivate
        howToUse: $howToUse
        imageUrls: $imageUrls
        name: $name
        preOrderLimit: $preOrderLimit
        preOrderMessage: $preOrderMessage
        productDescription: $productDescription
        productIngredients: $productIngredients
        productOptions: $productOptions
        productSubscriptions: $productSubscriptions
        warehouseInventory: $warehouseInventory
        ribbon: $ribbon
        salePrice: $salePrice
        videoUrls: $videoUrls
        weight: $weight
        weightType: $weightType
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
    $discountType: DISCOUNT_TYPE
    $discountValue: String
    $isDiscountAllowed: Boolean!
    $enablePreOrder: Boolean!
    $isPrivate: Boolean!
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
    $weightType: WEIGHT_TYPE!
  ) {
    updateProduct(
      updateProductInput: {
        brandId: $brandId
        discountType: $discountType
        discountValue: $discountValue
        isDiscountAllowed: $isDiscountAllowed
        enablePreOrder: $enablePreOrder
        isPrivate: $isPrivate
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
        weightType: $weightType
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
const createProductOptionQuery = gql`
  mutation createProductOption(
    $createProductOptionInput: CreateProductOptionInput!
    $productId: String!
  ) {
    createProductOption(
      createProductOptionInput: $createProductOptionInput
      productId: $productId
    ) {
      id
    }
  }
`;
const createProductCategoryQuery = gql`
  mutation createProductCategory($categoryId: String!, $productId: String!) {
    createProductCategory(categoryId: $categoryId, productId: $productId) {
      id
    }
  }
`;

const createProductSubscriptionQuery = gql`
  mutation createProductSubscription(
    $createProductSubscriptionInput: CreateProductOptionInput!
    $productId: String!
  ) {
    createProductSubscription(
      createProductSubscriptionInput: $createProductSubscriptionInput
      productId: $productId
    ) {
      id
    }
  }
`;

const editProductOptionQuery = gql`
  mutation updateProductOption(
    $choiceDisplay: String!
    $choices: [UpdateProductVariant!]
    $name: String!
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
  mutation updateMultipleProductInventory(
    $costPrice: String
    $products: [UpdateProductInventoryInput!]!
  ) {
    updateMultipleProductInventory(products: $products, costPrice: $costPrice) {
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
        productCostPrice {
          costPrice
          updatedAt
          id
          quantityLeft
        }
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

const deleteProductCategoryQuery = gql`
  mutation removeProductCategory($categoryId: String!, $productId: String!) {
    removeProductCategory(categoryId: $categoryId, productId: $productId) {
      status
    }
  }
`;

const deleteProductOptionQuery = gql`
  mutation removeProductOption($id: String!) {
    removeProductOption(id: $id) {
      status
    }
  }
`;

const deleteProductSubscriptionQuery = gql`
  mutation removeProductSubscription($id: String!) {
    removeProductSubscription(id: $id) {
      status
    }
  }
`;

const deleteProductReviewQuery = ({ productReviewId }) => gql`
  {
    __typename
    deleteProductReview(productReviewId: "${productReviewId}") {
      status
    }
  }
`;

const getProductReviewsQuery = ({ page, productId }) => gql`
  {
    __typename
    products_reviews_by_product_id(pageNumber: "${page}",productId:"${productId}") {
      total
      results {
        id
        createdAt
        rating
        review
        user{
          firstName
          lastName
        }
      }
    }
  }
`;

const getReviewsQuery = ({ page }) => gql`
  {
    __typename
    products_reviews_all(pageNumber: "${page}") {
      total
      results {
        id
        createdAt
        rating
        review
        orderId
        orderCode
        productId
        productName
        user{
          firstName
          lastName
          phoneNumber
        }
      }
    }
  }
`;
const apis = {
  getProducts: ({ page }) =>
    graphQlInstance(getProductsQuery({ page }), {
      method: "GET",
    }),
  getPrivateProducts: ({ page, isPrivate }) =>
    graphQlInstance(getPrivateProductsQuery({ page, isPrivate }), {
      method: "GET",
    }),
  getProductQuantitySoldByDateFilter: ({ productId, startDate, endDate }) =>
    graphQlInstance(
      getProductQuantitySoldByDateFilterQuery({
        productId,
        startDate,
        endDate,
      }),
      {
        method: "GET",
      }
    ),

  getProductQuantitySoldByDateFilterByBrandId: ({
    brandId,
    startDate,
    endDate,
  }) =>
    graphQlInstance(
      getProductQuantitySoldByDateFilterByBrandIdQuery({
        brandId,
        startDate,
        endDate,
      }),
      {
        method: "GET",
      }
    ),

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

  createProductOption: (variables) =>
    graphQlInstance(createProductOptionQuery, {
      variables,
    }),

  createProductCategory: (variables) =>
    graphQlInstance(createProductCategoryQuery, {
      variables,
    }),

  createProductSubscription: (variables) =>
    graphQlInstance(createProductSubscriptionQuery, {
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

  deleteProductCategory: (variables) =>
    graphQlInstance(deleteProductCategoryQuery, {
      variables,
    }),
  deleteProductOption: (variables) =>
    graphQlInstance(deleteProductOptionQuery, {
      variables,
    }),
  deleteProductSubscription: (variables) =>
    graphQlInstance(deleteProductSubscriptionQuery, {
      variables,
    }),

  deleteProductReview: ({ productReviewId }) =>
    graphQlInstance(deleteProductReviewQuery({ productReviewId }), {
      method: "GET",
    }),

  getProductReviews: ({ page, productId }) =>
    graphQlInstance(getProductReviewsQuery({ page, productId }), {
      method: "GET",
    }),

  getReviews: ({ page }) =>
    graphQlInstance(getReviewsQuery({ page }), {
      method: "GET",
    }),
};

export default apis;
