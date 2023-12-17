import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const searchOrdersQuery = ({ page, searchQuery }) => gql`
  {
    __typename
    searchOrders(pageNumber: "${page}", searchQuery: "${searchQuery}") {
      total
      results {
        calculatedOrder {
          totalAmount
          user {
            firstName
            lastName
          }
        }
        id
        deliveryMethod
        orderCode
        orderStatus
        orderSource
        paid
        paymentMethod
        updatedAt
        guestFirstName
        guestLastName
      }
    }
  }
`;
const getOrdersByUserQuery = ({ page, id }) => gql`
  {
    __typename
    orders_by_user_id(pageNumber: "${page}", id: "${id}") {
      total
      results {
        calculatedOrder {
          totalAmount
          user {
            firstName
            lastName
          }
        }
        id
        deliveryMethod
        orderSource
        orderCode
        orderStatus
        paid
        paymentMethod
        updatedAt
        guestFirstName
        guestLastName
      }
    }
  }
`;

const getOrdersQuery = ({
  page,
  status,
  startDate,
  endDate,
  deliveryHandler,
}) => gql`
  {
    __typename
    orders(pageNumber: "${page}", status: "${status}",startDate: "${startDate}", endDate: "${endDate}",  ${
  deliveryHandler ? `deliveryHandler:"${deliveryHandler}"` : ""
}) {
      total
      results {
        calculatedOrder {
          totalAmount
          user {
            firstName
            lastName
          }
        }
        id
        deliveryMethod
        orderSource
        orderCode
        orderStatus
        paid
        paymentMethod
        updatedAt
        guestFirstName
        guestLastName
      }
    }
  }
`;

const getBrandOrdersQuery = ({ page, id, startDate, endDate }) => gql`
  {
    __typename
    orders_by_brand_id(pageNumber: "${page}", id: "${id}",startDate: "${startDate}", endDate: "${endDate}") {
      total
      results {
        calculatedOrder {
          totalAmount
          user {
            firstName
            lastName
          }
        }
        id
        deliveryMethod
        orderCode
        orderStatus
        paid
        paymentMethod
        updatedAt
      }
    }
  }
`;

const getOrdersCountQuery = ({ page }) => gql`
  {
    __typename
    orders(pageNumber: "${page}") {
      total
    }
  }
`;
const getOrderQuery = ({ id }) => gql`
  {
    __typename
    order(id: "${id}") {
      calculatedOrder {
        address {
          addressText
        }
        calculatedOrderProducts {
          product {
            id
            name
            imageUrls
         
          }
          productOption {
            name
            choices{
              variantName
              variantSalePrice
              imageUrls
            }
          }
          productOptionChoiceIndex
          productOptionId
          quantity
        }
        deliveryFee
        freeDelivery
        serviceCharge
        totalAmount
        updatedAt
        user {
          firstName
          lastName
          phoneNumber
          gender
          email
        }
      }
      deliveryMethod
      guestAddress
      guestDeliveryFee
      guestEmail
      guestFirstName
      guestLastName
      guestPhoneNumber
      storePaymentMethod
      orderSource
      id
      orderCode
      orderStatus
      paid
      paymentMethod
      topshipDispatchStatus
      updatedAt
    }
  }
`;

const createOrderQuery = gql`
  mutation createOrder(
    $OrderDescription: String!
    $OrderLogoUrl: String!
    $OrderName: String!
    $OrderShortText: String!
    $categoryId: String
    $imageUrls: [String!]
    $videoUrls: [String!]
  ) {
    createOrder(
      createOrderInput: {
        OrderDescription: $OrderDescription
        OrderLogoUrl: $OrderLogoUrl
        OrderName: $OrderName
        OrderShortText: $OrderShortText
        categoryId: $categoryId
        imageUrls: $imageUrls
        videoUrls: $videoUrls
      }
    ) {
      id
    }
  }
`;

const updateOrderStatusQuery = gql`
  mutation updateOrderStatus($id: String!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      status
    }
  }
`;

const deleteOrderQuery = gql`
  mutation removeOrder($id: String!) {
    removeOrder(id: $id) {
      status
    }
  }
`;

const apis = {
  searchOrders: ({ page, searchQuery }) =>
    graphQlInstance(searchOrdersQuery({ page, searchQuery }), {
      method: "GET",
    }),
  getOrdersByUser: ({ page, id }) =>
    graphQlInstance(getOrdersByUserQuery({ page, id }), {
      method: "GET",
    }),
  getOrders: ({ page, status, startDate, endDate, deliveryHandler }) =>
    graphQlInstance(
      getOrdersQuery({ page, status, startDate, endDate, deliveryHandler }),
      {
        method: "GET",
      }
    ),
  getBrandOrders: ({ page, id, startDate, endDate }) =>
    graphQlInstance(getBrandOrdersQuery({ page, id, startDate, endDate }), {
      method: "GET",
    }),
  getOrdersCount: ({ page }) =>
    graphQlInstance(getOrdersCountQuery({ page }), {
      method: "GET",
    }),
  getOrder: ({ id }) =>
    graphQlInstance(getOrderQuery({ id }), {
      method: "GET",
    }),

  createOrder: (variables) =>
    graphQlInstance(createOrderQuery, {
      variables,
    }),

  updateOrderStatus: (variables) =>
    graphQlInstance(updateOrderStatusQuery, {
      variables,
    }),

  deleteOrder: (variables) =>
    graphQlInstance(deleteOrderQuery, {
      variables,
    }),
};

export default apis;
