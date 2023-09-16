import React, { useEffect, useMemo, useState } from "react";
import _, { isEmpty } from "lodash";
import { useNavigate, useParams } from "react-router";
import PropTypes from "prop-types";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";

import { pageCount } from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";

import useWindowDimensions from "hooks/useWindowDimensions";
import { transactionAmount } from "utils/transactions";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { Button } from "components/General/Button";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import classNames from "classnames";
import Tabs from "components/General/Tabs";
import { numberWithCommas } from "utils/formatter";
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
const ProductsPage = ({ isModal, handleProductSelect, isSelected }) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();

  const {
    getProducts,
    products,
    productsCount,
    loading,
    getArchivedProducts,
    loadingArchived,
    productsArchived,
    productsArchivedCount,
    searchProducts,
    searchResult,
    searchResultCount,
    searchProductLoading,
  } = ProductsStore;

  const TABS = [
    { name: "products", label: `Products (${productsCount || "-"})` },
    {
      name: "archived",
      label: `Archived products (${productsArchivedCount || "-"})`,
    },
  ];
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);
  const searchQuery = searchInput?.trim();
  const isSearchMode = searchQuery?.length > 1;
  const isArchive = activeTab === TABS[1]?.name;

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }
    const payload = { page: currentPage, searchQuery };
    await searchProducts({ data: payload });
  };

  const handleGetData = () => {
    isArchive
      ? getArchivedProducts({ data: { page: currentPageArchived } })
      : getProducts({ data: { page: currentPage } });
  };

  useEffect(() => {
    isSearchMode ? handleSearch() : handleGetData();
  }, [currentPage, currentPageSearch, currentPageArchived, isArchive]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      handleSearch();
    }
  }, [searchInput]);

  const handleEdit = (row) => {
    if (isModal) {
      handleProductSelect(row);
      return;
    }

    navigate(`/dashboard/products/edit/${warehouse_id}/${row?.id}`);
  };
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
          onClick={() => handleEdit(row)}
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
        <span onClick={() => handleEdit(row)} className="uppercase">
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
            onClick={() =>
              setCurrentTxnDetails({ ...row, modalType: "delete" })
            }
            className=" cursor-pointer px-4 py-1 rounded-full bg-red-deep text-[11px] text-white "
          >
            {row?.archive ? "Unarchive" : "Archive"}
          </span>

          <span
            onClick={() => handleEdit(row)}
            className=" cursor-pointer px-4 py-1 rounded-full bg-black text-[11px] text-white "
          >
            Edit
          </span>
        </div>
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

  const displayedProducts = useMemo(() => {
    return isSearchMode
      ? searchResult
      : isArchive
      ? productsArchived
      : products;
  }, [searchResult, products, productsArchived, isSearchMode, isArchive]);

  const displayedProductsCount = useMemo(() => {
    return isSearchMode
      ? searchResultCount
      : isArchive
      ? productsArchivedCount
      : productsCount;
  }, [searchResult, products, isSearchMode, productsArchivedCount]);

  const isLoading = useMemo(() => {
    return isSearchMode
      ? searchProductLoading
      : isArchive
      ? isEmpty(productsArchived) && loadingArchived
      : isEmpty(products) && loading;
  }, [searchProductLoading, loadingArchived, loading]);

  useEffect(() => scrollToTop(), [displayedProducts]);

  return (
    <>
      <div className={classNames("h-full w-full", { "md:pr-4": !isModal })}>
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <div
              className={classNames({
                "w-full": isModal,
                "w-full sm:w-[45%] sm:min-w-[300px]": !isModal,
              })}
            >
              <SearchBar
                placeholder={"Search products"}
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
          <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          {isLoading ? (
            <CircleLoader blue />
          ) : (
            <>
              {isSearchMode &&
                `Search results - ${numberWithCommas(searchResultCount)}`}
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {!isEmpty(displayedProducts) ? (
                  <Table
                    data={displayedProducts}
                    columns={
                      isModal
                        ? columns.slice(0, 2)
                        : width >= 640
                        ? columns
                        : columns.slice(0, 2)
                    }
                    onRowClicked={(e) => {
                      handleEdit(e);
                    }}
                    pointerOnHover
                    pageCount={displayedProductsCount / pageCount}
                    onPageChange={(page) =>
                      isSearchMode
                        ? setCurrentPageSearch(page)
                        : isArchive
                        ? setCurrentPageArchived(page)
                        : setCurrentPage(page)
                    }
                    currentPage={
                      isSearchMode
                        ? currentPageSearch
                        : isArchive
                        ? currentPageArchived
                        : currentPage
                    }
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
                            : isArchive
                            ? "There are currently no archived products"
                            : "There are currently no products"}
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
    </>
  );
};
ProductsPage.propTypes = {
  handleProductSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
};
export default observer(ProductsPage);
