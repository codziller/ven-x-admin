import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getUserQuery = ({ id }) => gql`
  {
    __typename
    user(id: "${id}") {
      balance
      baniCustomerRef
      createdAt
      dob
      email
      emailConfirmedTime
      firstName
      gender
      id
      isDeleted
      isEmailConfirmed
      lastName
      phoneNumber
      referralCode
      role
    }
  }
`;
const getUsersQuery = ({ page }) => gql`
  {
    __typename
    users(pageNumber: "${page}") {
      total
      results {
        balance
        baniCustomerRef
        createdAt
        dob
        email
        emailConfirmedTime
        firstName
        gender
        id
        isDeleted
        isEmailConfirmed
        lastName
        phoneNumber
        referralCode
        role
      }
    }
  }
`;

const searchUsersQuery = ({ page, searchQuery }) => gql`
  {
    __typename
    searchUsers(pageNumber: "${page}", searchQuery: "${searchQuery}") {
      total
      results {
        balance
        baniCustomerRef
        createdAt
        dob
        email
        emailConfirmedTime
        firstName
        gender
        id
        isDeleted
        isEmailConfirmed
        lastName
        phoneNumber
        referralCode
        role
      }
    }
  }
`;

const createUserQuery = gql`
  mutation createUser(
    discountCode: String!
    discountExpiryTime: DateTime!
    discountLimit: String
    discountType: DISCOUNT_TYPE!
    discountValue: String!
    userId: String!
    userProfitType: DISCOUNT_TYPE!
    userProfitValue: String!
  ) {
    createUser(
      createUserInput: {
        discountCode: $discountCode
        discountExpiryTime: $discountExpiryTime
        discountLimit: $discountLimit
        discountType: $discountType!
        discountValue: $discountValue
        userId: $userId
        userProfitType: $userProfitType
        userProfitValue: $userProfitValue
      }
    ) {
      id
    }
  }
`;

const editUserQuery = gql`
mutation updateUser(
  id: String!
  discountCode: String!
  discountExpiryTime: DateTime!
  discountLimit: String
  discountType: DISCOUNT_TYPE!
  discountValue: String!
  userId: String!
  userProfitType: DISCOUNT_TYPE!
  userProfitValue: String!
) {
  updateUser(
    updateUserInput: {
      id: $id
      discountCode: $discountCode
      discountExpiryTime: $discountExpiryTime
      discountLimit: $discountLimit
      discountType: $discountType!
      discountValue: $discountValue
      userId: $userId
      userProfitType: $userProfitType
      userProfitValue: $userProfitValue
    }
  ) {
    id
  }
}
`;

const deleteUserQuery = gql`
  mutation removeUser($id: String!) {
    removeUser(id: $id) {
      status
    }
  }
`;

const apis = {
  getUsers: ({ page }) =>
    graphQlInstance(getUsersQuery({ page }), {
      method: "GET",
    }),
  searchUsers: ({ page, searchQuery }) =>
    graphQlInstance(searchUsersQuery({ page, searchQuery }), {
      method: "GET",
    }),
  getUser: ({ id }) =>
    graphQlInstance(getUserQuery({ id }), {
      method: "GET",
    }),

  createUser: (variables) =>
    graphQlInstance(createUserQuery, {
      variables,
    }),

  editUser: (variables) =>
    graphQlInstance(editUserQuery, {
      variables,
    }),

  deleteUser: (variables) =>
    graphQlInstance(deleteUserQuery, {
      variables,
    }),
};

export default apis;
