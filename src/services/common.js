import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getBrandHomePageStatsQuery = ({ id, startDate, endDate }) => gql`
  {
    __typename
    brandHomePageStats(id: "${id}", startDate: "${startDate}", endDate: "${endDate}") {
      totalOrders
      totalProducts
      totalRevenue
    }
  }
`;

const getAdminHomePageStatsQuery = ({ startDate, endDate }) => gql`
  {
    __typename
    adminHomePageStats(startDate: "${startDate}", endDate: "${endDate}") {
      totalOrders
      totalProducts
      totalRevenue
      totalUsers
    }
  }
`;

const apis = {
  getBrandHomePageStats: ({ id, startDate, endDate }) =>
    graphQlInstance(getBrandHomePageStatsQuery({ id, startDate, endDate }), {
      method: "GET",
    }),
  getAdminHomePageStats: ({ startDate, endDate }) =>
    graphQlInstance(getAdminHomePageStatsQuery({ startDate, endDate }), {
      method: "GET",
    }),
};

export default apis;
