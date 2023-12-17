import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getBrandHomePageStatsQuery = ({ id, startDate, endDate }) => gql`
  {
    __typename
    brandHomePageStats(id: "${id}", startDate: "${startDate}", endDate: "${endDate}") {
      totalOrders
      totalProducts
      totalRevenue
      averageOrderValue
      totalGrossRevenue
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
      totalGrossRevenue
      totalDeliveryRevenue
      averageOrderValue
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
