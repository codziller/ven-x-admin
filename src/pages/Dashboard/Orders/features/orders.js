import React, { useEffect, useMemo, useState } from "react";

import moment from "moment";
import _, { isEmpty, lowerCase } from "lodash";
import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import {
  ORDER_STATUSES,
  ORDER_STATUS_OPTIONS,
  pageCount,
} from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";

import useWindowDimensions from "hooks/useWindowDimensions";
import { transactionAmount } from "utils/transactions";
import TransactionDetailsModal from "./OrderDetailsModal";
import dateConstants from "utils/dateConstants";
import DateRangeModal from "components/General/Modal/DateRangeModal/DateRangeModal";
import OrdersStore from "../store";
import { useParams } from "react-router-dom";
import SearchBar from "components/General/Searchbar/SearchBar";
import { observer } from "mobx-react-lite";
import { numberWithCommas } from "utils/formatter";
import classNames from "classnames";
import Tabs from "components/General/Tabs";
import TableDropdown from "components/General/Dropdown/TableDropdown";
import { convertToJs } from "utils/functions";
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

const { DISPATCHED, CANCELLED, COMPLETED, INPROGRESS, PENDING } =
  ORDER_STATUSES;
const Orders = ({ isRecent }) => {
  const {
    getOrders,
    loading,
    ordersCount,
    orders,
    searchOrders,
    searchLoading,
    searchResult,
    searchResultCount,

    in_progressOrders,
    in_progressOrdersCount,
    pendingOrders,
    pendingOrdersCount,
    dispatchedOrders,
    dispatchedOrdersCount,
    completedOrders,
    completedOrdersCount,
    cancelledOrders,
    cancelledOrdersCount,
    updateOrderStatusLoading,
  } = OrdersStore;

  const TABS = [
    {
      name: INPROGRESS,
      label: `Inprogress orders (${in_progressOrdersCount || "0"})`,
    },
    { name: PENDING, label: `Pending orders (${pendingOrdersCount || "0"})` },
    {
      name: DISPATCHED,
      label: `Dispatched orders (${dispatchedOrdersCount || "0"})`,
    },
    {
      name: COMPLETED,
      label: `Completed orders (${completedOrdersCount || "0"})`,
    },
    {
      name: CANCELLED,
      label: `Cancelled orders (${cancelledOrdersCount || "0"})`,
    },
  ];

  const { width } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);

  const searchQuery = searchInput?.trim();
  const isSearchMode = searchQuery?.length > 1;

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }
    const payload = { page: currentPage, searchQuery };
    await searchOrders({ data: payload });
  };

  const handleGetAllData = () => {
    getOrders({ data: { page: 1, status: PENDING } });
    getOrders({ data: { page: 1, status: DISPATCHED } });
    getOrders({ data: { page: 1, status: COMPLETED } });
    getOrders({ data: { page: 1, status: CANCELLED } });
  };
  const handleGetData = () => {
    getOrders({ data: { page: currentPage, status: activeTab } });
  };

  useEffect(() => {
    handleGetAllData();
  }, []);
  useEffect(() => {
    isSearchMode ? handleSearch() : handleGetData();
  }, [currentPage, currentPageSearch, activeTab]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      handleSearch();
    }
  }, [searchInput]);

  const handleView = (row) => {
    setCurrentTxnDetails({ ...row, modalType: "details", isSideModal: true });
  };
  const columns = [
    {
      name: "Order Code",
      selector: "orderCode",
      sortable: false,
    },
    {
      name: "Customer",
      selector: (row) => (
        <span onClick={() => handleView(row)}>
          {row?.guestFirstName || row?.calculatedOrder?.user?.firstName}{" "}
          {row?.guestLastName || row?.calculatedOrder?.user?.lastName}
        </span>
      ),
      sortable: false,
    },
    {
      name: "Order Status",

      selector: (row) => (
        <TableDropdown
          className={classNames({
            "text-yellow":
              row?.orderStatus === "IN_PROGRESS" ||
              row?.orderStatus === "PENDING" ||
              row?.orderStatus === "DISPATCHED",
            "text-green": row?.orderStatus === "COMPLETED",
            "text-red-deep": row?.orderStatus === "CANCELLED",
          })}
          options={ORDER_STATUS_OPTIONS}
          content={row.orderStatus}
          handleClick={(e) =>
            setCurrentTxnDetails({ ...row, modalType: "prompt", ...e })
          }
          isLoading={
            currentTxnDetails?.orderCode === row?.orderCode &&
            updateOrderStatusLoading
          }
        />
      ),
      sortable: false,
    },

    {
      name: "Order Source",
      selector: (row) => (
        <span
          className={classNames({
            "text-grey-text3": !row?.orderSource,
            "text-blue-bright":
              row?.orderSource === "WEB" || row?.orderSource === "APP",
            "text-blue-textHover": row?.orderSource === "STORE",
            "text-green": row?.orderSource === "WHATSAPP",
            "text-red-deep": row?.orderSource === "INSTAGRAM",
          })}
          onClick={() => handleView(row)}
        >
          {row?.orderSource}
        </span>
      ),
      sortable: false,
    },

    {
      name: "Delivery Method",
      selector: (row) => (
        <span onClick={() => handleView(row)}>{row?.deliveryMethod}</span>
      ),
      sortable: false,
    },
    {
      name: "Order Date",
      selector: (row) => moment(row.updatedAt).format("MMM Do, YYYY hh:mma"),
      sortable: true,
    },

    {
      name: "Total",
      selector: (row) => (
        <span onClick={() => handleView(row)} className="uppercase">
          {transactionAmount(row)}
        </span>
      ),
      sortable: true,
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const displayedItems = useMemo(() => {
    let items = [];
    switch (activeTab) {
      case INPROGRESS:
        items = in_progressOrders;
        break;
      case PENDING:
        items = pendingOrders;
        break;
      case DISPATCHED:
        items = dispatchedOrders;
        break;
      case COMPLETED:
        items = completedOrders;
        break;
      case CANCELLED:
        items = cancelledOrders;
        break;
      default:
        items = orders;
        break;
    }
    return isSearchMode ? searchResult : items;
  }, [
    searchResult,
    activeTab,
    isSearchMode,
    in_progressOrders,
    pendingOrders,
    dispatchedOrders,
    completedOrders,
    cancelledOrders,
  ]);

  const displayedItemsCount = useMemo(() => {
    let itemsCount;
    switch (activeTab) {
      case INPROGRESS:
        itemsCount = in_progressOrdersCount;
        break;
      case PENDING:
        itemsCount = pendingOrdersCount;
        break;
      case DISPATCHED:
        itemsCount = dispatchedOrdersCount;
        break;
      case COMPLETED:
        itemsCount = completedOrdersCount;
        break;
      case CANCELLED:
        itemsCount = cancelledOrdersCount;
        break;
      default:
        itemsCount = ordersCount;
        break;
    }
    return isSearchMode ? searchResultCount : itemsCount;
  }, [searchResult, activeTab, isSearchMode, displayedItems]);

  const isLoading = useMemo(() => {
    return isSearchMode ? searchLoading : loading;
  }, [searchLoading, loading]);

  useEffect(() => scrollToTop(), [displayedItems]);

  console.log("searchResult: ", convertToJs(searchResult));
  return (
    <>
      <div className="h-full w-full">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          {!isRecent && (
            <div className="flex justify-between items-center w-full mb-3 gap-1">
              <div className="sm:min-w-[200px]">
                <DashboardFilterDropdown
                  placeholder="Filter by: "
                  options={dateFilters}
                  name="payout_filter"
                  onClick={(e) => setDateFilter(e)}
                  value={dateFilter?.label}
                />
              </div>

              <div className="flex justify-start items-center w-full truncate text-base">
                {dateFilter.value === "today"
                  ? moment(dateFilter.start_date).format("MMM Do, YYYY")
                  : `${moment(dateFilter.start_date).format(
                      "MMM Do, YYYY"
                    )} - ${moment(dateFilter.end_date).format("MMM Do, YYYY")}`}
              </div>
            </div>
          )}
          {isRecent && (
            <p className="font-700 text-start w-full pl-3 mt-5">
              Recent Orders
            </p>
          )}
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <div
              className={classNames("w-full sm:w-[45%] sm:min-w-[300px]", {
                "ml-3 mt-3": isRecent,
              })}
            >
              <SearchBar
                placeholder={"Search orders"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>
          </div>
          <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          {isLoading ? (
            <CircleLoader blue />
          ) : (
            <>
              {isSearchMode &&
                `Search results - ${numberWithCommas(searchResultCount)}`}

              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {!isEmpty(displayedItems) ? (
                  <Table
                    data={displayedItems}
                    columns={width >= 640 ? columns : columns.slice(0, 2)}
                    onRowClicked={(e) => {
                      handleView(e);
                    }}
                    pointerOnHover
                    pageCount={displayedItemsCount / pageCount}
                    onPageChange={(page) =>
                      isSearchMode
                        ? setCurrentPageSearch(page)
                        : setCurrentPage(page)
                    }
                    currentPage={isSearchMode ? currentPageSearch : currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      {
                        <span>
                          {isSearchMode && isEmpty(searchResult)
                            ? `There are no results for your search '${searchQuery}'`
                            : `There are currently no ${lowerCase(
                                activeTab?.replaceAll("_", " ")
                              )} orders`}
                        </span>
                      }
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <TransactionDetailsModal
        active={!!currentTxnDetails}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />
      <DateRangeModal
        active={dateFilter.value === "custom"}
        toggler={() =>
          setDateFilter({
            value: `${moment(dateConstants?.startOfWeek).format(
              "DD MMM"
            )} - ${moment(dateConstants?.endOfWeek).format("DD MMM")}`,
            label: `${moment(dateConstants?.startOfWeek).format(
              "DD MMM"
            )} - ${moment(dateConstants?.endOfWeek).format("DD MMM")}`,
            start_date: dateConstants?.startOfWeek,
            end_date: dateConstants?.endOfWeek,
          })
        }
      />
    </>
  );
};

export default observer(Orders);
