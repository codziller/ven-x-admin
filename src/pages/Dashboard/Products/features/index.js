import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";
import qs from "query-string";
import { useNavigate, useParams } from "react-router";

import useTableFilter from "hooks/tableFilter";
import ActiveFilter from "components/General/ActiveFilter";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";

import { pageCount } from "utils/appConstant";
import { hasValue } from "utils/validations";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";

import useWindowDimensions from "hooks/useWindowDimensions";

import { paramsObjectToQueryString } from "utils/request";
import { transactionAmount } from "utils/transactions";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { Button } from "components/General/Button";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
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
];
const ProductsPage = () => {
  const navigate = useNavigate();
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
  const { getProducts, products, productsCount, loading } = ProductsStore;

  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getProducts({ data: { page: currentPage } });
  }, [currentPage]);

  const params = qs.parse(location.hash?.substring(1));

  const searchQuery = searchInput?.trim();

  const { filterData, onRemoveFilter } = useTableFilter({
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

  const columns = [
    {
      name: "SKU",
      minWidth: "20px",
      maxWidth: isMobile ? "10%" : "70px",
      selector: "id",
      sortable: false,
    },
    {
      name: "Product",
      minWidth: isMobile ? "40%" : "30%",
      selector: (row) => (
        <div
          className="flex justify-start items-center gap-4"
          onClick={() => {
            navigate(
              `/dashboard/products/edit-product/${warehouse_id}/${row?.id}`
            );
          }}
        >
          {row?.imageUrls?.[0] && (
            <img
              src={row?.imageUrls?.[0]}
              className="w-[45px] h-[45px] min-w-[45px] min-h-[45px]"
            />
          )}
          <span className="truncate">{row.name}</span>
        </div>
      ),
      sortable: false,
    },

    {
      name: "Category",
      selector: "category.name",
      sortable: false,
    },

    {
      name: "Qty Available",
      selector: "quantity",
      sortable: true,
    },

    {
      name: "Price",
      selector: (row) => (
        <span
          onClick={() => {
            navigate(
              `/dashboard/products/edit-product/${warehouse_id}/${row?.id}`
            );
          }}
          className="uppercase"
        >
          {transactionAmount(row)}
        </span>
      ),
      sortable: true,
    },

    {
      name: "Actions",
      minWidth: isMobile ? "50%" : "25%",
      selector: (row) => (
        <div className="flex justify-start items-center gap-1.5">
          <span
            onClick={() => {
              navigate(
                `/dashboard/products/edit-product/${warehouse_id}/${row?.id}`
              );
            }}
            className=" cursor-pointer px-4 py-1 rounded-full bg-black text-[11px] text-white "
          >
            Edit
          </span>

          <span
            // onClick={() =>
            //   setCurrentTxnDetails({
            //     ...row,
            //     modalType: "delete",
            //     modalSize: "sm",
            //   })
            // }
            className=" cursor-pointer px-4 py-1 rounded-full bg-red-deep text-[11px] text-white "
          >
            Delete
          </span>
        </div>
      ),
      sortable: true,
    },
  ];

  const containsActiveFilter = () =>
    Object.keys(filterData).filter(
      (item) => filterData[item] && filterData[item] !== ""
    );

  const renderFilters = () => {
    if (filterData) {
      return containsActiveFilter().map((item) => {
        const hasChanged = defaultFilters[item] !== filterData[item];
        if (hasChanged) {
          return (
            <ActiveFilter
              key={item}
              type={_.lowerCase(item).replace(/ /g, " ")}
              value={
                moment(filterData[item]?.value || filterData[item]).isValid()
                  ? filterData[item]?.value || filterData[item]
                  : _.lowerCase(filterData[item]?.value).replace(/ /g, " ")
              }
              onRemove={() => onRemoveFilter(item)}
            />
          );
        }
        return null;
      });
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToTop(), [products]);

  return (
    <>
      <div className="h-full md:pr-4">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <div className="w-full sm:w-[45%] sm:min-w-[300px]">
              <SearchBar
                placeholder={"Search for a product"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>
            <Link to={`/dashboard/products/add-product/${warehouse_id}`}>
              <Button
                text="Add New Product"
                icon={<Plus className="stroke-current" />}
                className="hidden md:block"
              />
            </Link>
          </div>

          {loading ? (
            <CircleLoader blue />
          ) : (
            <>
              {containsActiveFilter().length > 0 && (
                <div className="active-filters-container flex items-center w-full">
                  <p className="title-text mr-[8px] text-blue">Filters:</p>
                  <div className="active-filter-list flex items-center space-x-[8px]">
                    {renderFilters()}
                  </div>
                </div>
              )}

              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {products?.length > 0 ? (
                  <Table
                    data={products?.length ? products.slice(0, pageCount) : []}
                    columns={width >= 640 ? columns : columns.slice(0, 3)}
                    onRowClicked={(e) => {
                      navigate(
                        `/dashboard/products/edit-product/${warehouse_id}/${e?.id}`
                      );
                    }}
                    pointerOnHover
                    isLoading={loading}
                    pageCount={productsCount / pageCount}
                    onPageChange={(page) => setCurrentPage(page)}
                    currentPage={currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      <span>You have no products currently</span>
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
    </>
  );
};

export default observer(ProductsPage);
