import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getOrdersQuery = ({ page, status }) => gql`
  {
    __typename
    orders(pageNumber: "${page}", status: "${status}") {
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
      id
      orderCode
      orderStatus
      paid
      paymentMethod
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
  getOrders: ({ page, status }) =>
    graphQlInstance(getOrdersQuery({ page, status }), {
      method: "GET",
    }),
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
