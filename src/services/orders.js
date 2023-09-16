import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getOrdersQuery = ({ page }) => gql`
  {
    __typename
    orders(pageNumber: "${page}") {
      total
      results {
        calculatedOrder {
          totalAmount
          user {
            firstName
            lastName
          }
        }
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
        calculatedOrderProducts{
          product{
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

const editOrderQuery = gql`
  mutation updateOrder(
    $id: String!
    $OrderDescription: String
    $OrderLogoUrl: String
    $OrderName: String
    $OrderShortText: String
    $categoryId: String
    $imageUrls: [String!]
    $videoUrls: [String!]
  ) {
    updateOrder(
      updateOrderInput: {
        id: $id
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

const deleteOrderQuery = gql`
  mutation removeOrder($id: String!) {
    removeOrder(id: $id) {
      status
    }
  }
`;

const apis = {
  getOrders: ({ page }) =>
    graphQlInstance(getOrdersQuery({ page }), {
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

  editOrder: (variables) =>
    graphQlInstance(editOrderQuery, {
      variables,
    }),

  deleteOrder: (variables) =>
    graphQlInstance(deleteOrderQuery, {
      variables,
    }),
};

export default apis;
