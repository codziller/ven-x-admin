import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";
import qs from "query-string";

import useTableFilter from "hooks/tableFilter";
import ActiveFilter from "components/General/ActiveFilter";
import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";

import { transactions } from "utils/appConstant";
import { hasValue } from "utils/validations";
import { ReactComponent as OrdersIcon } from "assets/icons/orders-icon.svg";
import { ReactComponent as IncomeIcon } from "assets/icons/income-icon.svg";
import { ReactComponent as ProductsIcon } from "assets/icons/products-icon.svg";
import { ReactComponent as CustomersIcon } from "assets/icons/customers-icon.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import OrdersPage from "pages/Dashboard/Orders/features";
import { paramsObjectToQueryString } from "utils/request";
import ProductsStore from "pages/Dashboard/Products/store";
import OrdersStore from "pages/Dashboard/Orders/store";
import UsersStore from "pages/Dashboard/Users/store";
import EarningCard from "./EarningCard";
import { transactionAmount } from "utils/transactions";
import TransactionDetailsModal from "./OrderDetailsModal";
import dateConstants from "utils/dateConstants";
import EarningValueCard from "./EarningValueCard";
import TransactionValueCard from "./TransactionValueCard";
import { observer } from "mobx-react-lite";
import { numberWithCommas } from "utils/formatter";
import { useParams } from "react-router-dom";
import AuthStore from "pages/OnBoarding/SignIn/store";

import HomeStore from "../store";
import DateRangeModal from "components/General/Modal/DateRangeModal/DateRangeModal";
import { convertToJs } from "utils/functions";
import Amount from "components/General/Numbers/Amount";
export const dateFilters = [
  {
    value: "today",
    label: "Today",
    start_date: dateConstants?.today,
    end_date: dateConstants?.today,
  },
  {
    value: "this_week",
    label: "This Week",
    start_date: dateConstants?.startOfWeek,
    end_date: dateConstants?.endOfWeek,
  },
  {
    value: "all_time",
    label: "All Time",
    start_date: dateConstants?.firstDay,
    end_date: dateConstants?.today,
  },

  {
    value: "custom",
    label: "Custom Date",
    start_date: dateConstants?.startOfWeek,
    end_date: dateConstants?.endOfWeek,
  },
];
const HomePage = () => {
  const { warehouse_id } = useParams();
  const requiredFilters = {
    start_date: "2020-01-01",
    end_date: moment().format("YYYY-MM-DD"),
  };

  const defaultFilters = {
    start_date: "",
    end_date: "",
    tx_verb: "",
    fiat_wallet_id: "",
    coin_wallet_id: "",
    account_status: "",
  };

  const { width } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);

  const [showDateModal, setShowDateModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const { userIsAdmin, userIsBrandStaff } = AuthStore;
  const { getProductsCount, productsCount, loading } = ProductsStore;
  const { ordersCount, loading: orderLoading } = OrdersStore;
  const { getUsers, usersCount, loading: usersLoading } = UsersStore;
  const {
    getBrandHomePageStats,
    getAdminHomePageStats,
    adminHomePageStats,
    brandHomePageStats,
    loading: statLoading,
  } = HomeStore;
  useEffect(() => {
    getProductsCount({ data: { page: 1 } });
    userIsAdmin && getUsers({ data: { page: 1 } });
  }, []);

  useEffect(() => {
    if (userIsBrandStaff) {
      getBrandHomePageStats({
        data: {
          endDate: dateFilter.end_date,
          id: warehouse_id,
          startDate: dateFilter.start_date,
        },
      });
    }
  }, [userIsBrandStaff, dateFilter, warehouse_id]);

  const params = qs.parse(location.hash?.substring(1));

  const searchQuery = searchInput?.trim();

  const { filterData } = useTableFilter({
    defaultFilters,
    currentPage,
    setCurrentPage,
    params,
  });

  const fetchMerchants = () => {
    const filters = {
      start_date: hasValue(filterData?.start_date)
        ? filterData?.start_date
        : requiredFilters.start_date,
      end_date: hasValue(filterData?.end_date)
        ? filterData?.end_date
        : requiredFilters.end_date,
      ...(hasValue(searchQuery) && {
        account_trade_name: searchQuery,
      }),
      ...(hasValue(filterData?.account_status) && {
        account_status: filterData.account_status.value,
      }),
    };

    const paramsData = {
      ...filters,
    };

    if (
      _.isEqual(
        { start_date: paramsData.start_date, end_date: paramsData.end_date },
        requiredFilters
      )
    ) {
      delete paramsData.start_date;
      delete paramsData.end_date;
    }

    window.location.hash = paramsObjectToQueryString(paramsData);
  };

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchInput]);

  useEffect(() => {
    console.log(fetchMerchants);
    // fetchMerchants();
  }, [currentPage, filterData]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      // fetchMerchants();
    }
  }, [searchInput]);

  console.log("brandHomePageStats: ", convertToJs(brandHomePageStats));
  const homepageStats = brandHomePageStats;
  return (
    <>
      <div className="h-full md:pr-4">
        <div className="flex flex-col justify-start items-start h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-fit mb-3 gap-1">
            <div className="w-full sm:w-[200px]">
              <DashboardFilterDropdown
                placeholder="Filter by: "
                options={dateFilters}
                name="payout_filter"
                onClick={(e) => {
                  if (e.value === "custom") {
                    setShowDateModal(true);
                    return;
                  }
                  setDateFilter(e);
                }}
                value={dateFilter?.label}
              />
            </div>

            <div className="flex justify-start items-center w-fit truncate text-base">
              {dateFilter.value === "today"
                ? moment(dateFilter.start_date).format("MMM Do, YYYY")
                : `${moment(dateFilter.start_date).format(
                    "MMM Do, YYYY"
                  )} - ${moment(dateFilter.end_date).format("MMM Do, YYYY")}`}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 smlg:grid-cols-4 gap-4 justify-between items-start w-full mb-2">
            <EarningCard
              icon={<OrdersIcon className="scale-[0.8]" />}
              title="Orders"
              value={homepageStats?.totalOrders}
              link={!userIsAdmin ? "#" : `/dashboard/orders/${warehouse_id}`}
              isLoading={statLoading}
            />
            <EarningCard
              icon={<IncomeIcon className="scale-[0.8]" />}
              title="Income"
              value={homepageStats?.totalRevenue}
              link={!userIsAdmin ? "#" : `/dashboard/orders/${warehouse_id}`}
              isLoading={statLoading}
              decimalValue={"00"}
              isAmount
            />
            <EarningCard
              icon={<ProductsIcon className="scale-[0.8]" />}
              title="Total Products"
              value={
                userIsBrandStaff
                  ? homepageStats?.totalProducts
                  : numberWithCommas(productsCount)
              }
              link={!userIsAdmin ? "#" : `/dashboard/products/${warehouse_id}`}
              isLoading={loading || statLoading}
            />
            {userIsAdmin && (
              <EarningCard
                icon={<CustomersIcon className="scale-[0.8]" />}
                title="All Users"
                value={numberWithCommas(usersCount)}
                link={!userIsAdmin ? "#" : `/dashboard/users/${warehouse_id}`}
                isLoading={usersLoading}
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-between items-start w-full mb-2">
            <EarningValueCard />

            <TransactionValueCard />
          </div>

          <div className="w-full flex flex-col bg-white">
            <OrdersPage isRecent />
          </div>
        </div>
      </div>

      <TransactionDetailsModal
        active={!!currentTxnDetails}
        transaction={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />

      <DateRangeModal
        active={showDateModal}
        defaultDate={{
          startDate: new Date(dateFilter.start_date),
          endDate: new Date(dateFilter.end_date),
          key: "selection",
        }}
        onApply={(date) =>
          setDateFilter({
            value: `${moment(date?.startDate).format("DD MMM")} - ${moment(
              date?.endDate
            ).format("DD MMM")}`,
            label: `${moment(date?.startDate).format("DD MMM")} - ${moment(
              date?.endDate
            ).format("DD MMM")}`,
            start_date: date?.startDate,
            end_date: date?.endDate,
          })
        }
        toggler={() => setShowDateModal(false)}
      />
    </>
  );
};

export default observer(HomePage);
