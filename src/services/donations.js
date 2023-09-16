import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getDonationWalletQuery = () => gql`
  {
    __typename
    donation_wallet {
      balance
    }
  }
`;
const getDonationTransactionsQuery = ({ page }) => gql`
  {
    __typename
    donation_wallet_transactions(pageNumber: "${page}") {
      total
      results {
        amount
        user {
          firstName
          lastName
          email
          phoneNumber
        }
        createdAt
      }
    }
  }
`;

const apis = {
  getDonationTransactions: ({ page }) =>
    graphQlInstance(getDonationTransactionsQuery({ page }), {
      method: "GET",
    }),

  getDonationWallet: () =>
    graphQlInstance(getDonationWalletQuery(), {
      method: "GET",
    }),
};

export default apis;
