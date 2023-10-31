import React, { useEffect, useMemo, useState } from "react";
import _, { isEmpty } from "lodash";
import PropTypes from "prop-types";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";

import {
  INVENTORY_MODAL_TYPES,
  PRODUCT_REQUEST_STATUSES,
  pageCount,
} from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";

import useWindowDimensions from "hooks/useWindowDimensions";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { observer } from "mobx-react-lite";
import ProductsStore from "pages/Dashboard/Products/store";
import classNames from "classnames";
import Tabs from "components/General/Tabs";
import { numberWithCommas } from "utils/formatter";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "components/General/Button";
import CheckBox from "components/General/Input/CheckBox";
import Input from "components/General/Input/Input";
import { flattenArrayToString } from "utils/functions";
import ProductTransferRequests from "./ProductTransferRequests";
import ProductRequests from "./ProductRequests";
import { toJS } from "mobx";
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
const { COST_PRICE_HISTORY, REQUEST_PRODUCT } = INVENTORY_MODAL_TYPES;
const { PENDING, INPROGRESS } = PRODUCT_REQUEST_STATUSES;
const InventoryPage = ({ isModal, handleProductSelect, isSelected }) => {
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
    productTransferRequestsCount,
    getProductTransferRequests,
    productRequestsCount,
    getProductRequests,
  } = ProductsStore;

  const TABS = [
    { name: "products", label: `Products (${productsCount || "-"})` },

    {
      name: "requests",
      label: `Products requested (${productRequestsCount || "-"})`,
    },
    {
      name: "transfer_requests",
      label: `Product transfer requests (${
        productTransferRequestsCount || "-"
      })`,
    },
    {
      name: "archived",
      label: `Archived products (${productsArchivedCount || "-"})`,
    },
  ];
  const navigate = useNavigate();
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);
  const [requestMode, setRequestMode] = useState(false);
  const [requestProducts, setRequestProducts] = useState([]);
  const searchQuery = searchInput?.trim();
  const isSearchMode = searchQuery?.length > 1;
  const isArchive = activeTab === "archived";

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }
    const payload = { page: currentPage, searchQuery };
    await searchProducts({ data: payload, warehouse_id });
  };

  const handleGetData = () => {
    isArchive
      ? getArchivedProducts({
          data: { page: currentPageArchived },
          warehouse_id,
        })
      : getProducts({ data: { page: currentPage }, warehouse_id });
    getProductTransferRequests({
      data: {
        page: 1,
        warehouseId: warehouse_id,
        status: PENDING,
      },
    });

    getProductRequests({
      data: {
        page: 1,
        warehouseId: warehouse_id,
        status: INPROGRESS,
      },
    });
  };

  useEffect(() => {
    isSearchMode ? handleSearch() : handleGetData();
  }, [currentPage, currentPageSearch, currentPageArchived, isArchive]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      handleSearch();
    }
  }, [searchInput]);

  const handleRequestProductsChange = (row) => {
    const newRequestProductsArray = requestProducts?.map((item) => {
      if (item?.productId === row.productId) {
        return row;
      } else {
        return item;
      }
    });

    setRequestProducts(newRequestProductsArray);
  };

  const handleRequestProductsUpdate = (row) => {
    let newRequestProductsArray = requestProducts;
    if (
      newRequestProductsArray?.find(
        (item) => item?.productId === row?.productId
      )
    ) {
      newRequestProductsArray = newRequestProductsArray.filter(
        (item) => item?.productId !== row?.productId
      );
    } else {
      newRequestProductsArray = [...newRequestProductsArray, row];
    }

    setRequestProducts(newRequestProductsArray);
  };
  const handleEdit = (row) => {
    if (isModal) {
      handleProductSelect(row);
      return;
    }

    if (requestMode) {
      handleRequestProductsUpdate({
        productId: row?.id,
        quantity: 1,
      });
      return;
    }

    navigate(`/dashboard/inventory/edit/${warehouse_id}/${row?.id}`);
  };

  const columns = [
    requestMode
      ? {
          name: "Request quantity",
          maxWidth: "180px",
          minWidth: "180px",
          selector: (row) => {
            const item = requestProducts.find(
              (item) => item?.productId === row.id
            );
            const isChecked = !!item;

            return (
              <div className="flex justify-start items-center gap-4">
                <div className="min-w-[20px]">
                  <CheckBox
                    onChange={() => handleEdit(row)}
                    checked={isChecked}
                    square
                  />
                </div>
                {isChecked && (
                  <Input
                    value={item.quantity}
                    onChangeFunc={(val) => {
                      if (!val) {
                        handleRequestProductsUpdate({
                          productId: row?.id,
                        });
                        return;
                      }
                      handleRequestProductsChange({
                        productId: row?.id,
                        quantity: val,
                      });
                    }}
                    type="number"
                    placeholder="Product quantity"
                    noError
                    isRequired
                  />
                )}
              </div>
            );
          },
        }
      : null,
    {
      name: "SKU",
      minWidth: "20px",
      maxWidth: isMobile ? "10%" : "50px",
      selector: "id",
      sortable: false,
    },
    {
      name: "Product",
      minWidth: isMobile ? "40%" : "350px",
      maxWidth: isMobile ? "40%" : "350px",
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
      name: "Categories",
      selector: (row) => (
        <div onClick={() => handleEdit(row)}>
          {flattenArrayToString(row.categories)}
        </div>
      ),
      sortable: false,
      maxWidth: "350px",
    },

    {
      name: "Qty Available",
      minWidth: "100px",
      maxWidth: "100px",
      selector: (row) => (
        <div onClick={() => handleEdit(row)}>
          {numberWithCommas(row?.inventoryDetails?.quantity)}
        </div>
      ),
      sortable: false,
      sortable: true,
    },
    {
      name: "Low stock at",
      minWidth: "100px",
      maxWidth: "100px",
      selector: (row) => (
        <div onClick={() => handleEdit(row)}>
          {numberWithCommas(row?.inventoryDetails?.lowInQuantityValue)}
        </div>
      ),
      sortable: true,
    },

    {
      name: "Actions",
      minWidth: isMobile ? "50%" : "45%",
      selector: (row) => (
        <div className="flex justify-start items-center gap-1.5">
          <span
            onClick={() =>
              setCurrentTxnDetails({
                ...row,
                modalSize: "lg",
                modalType: COST_PRICE_HISTORY,
              })
            }
            className=" cursor-pointer px-4 py-1 rounded-full bg-white text-[11px] text-black border-[1px] border-grey-bordercolor "
          >
            Cost prices
          </span>

          <span
            onClick={() =>
              setCurrentTxnDetails({ ...row, modalType: REQUEST_PRODUCT })
            }
            className=" cursor-pointer px-4 py-1 rounded-full bg-white text-[11px] text-black border-[1px] border-grey-bordercolor "
          >
            Request
          </span>
          <span
            onClick={() => handleEdit(row)}
            className=" cursor-pointer px-4 py-1 rounded-full bg-black text-[11px] text-white "
          >
            Edit
          </span>

          <Link to={`/dashboard/products/edit/${warehouse_id}/${row?.id}`}>
            <span className=" cursor-pointer px-4 py-1 rounded-full bg-black text-[11px] text-white ">
              View
            </span>
          </Link>
        </div>
      ),
      sortable: true,
    },
  ].filter((item) => item);

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

  console.log("products: ", toJS(products));
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
                placeholder={"Search inventory"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>

            {/* <Button
              text={
                requestMode
                  ? `Deselect (${requestProducts?.length})`
                  : "Request Products"
              }
              className="hidden md:block"
              onClick={() => {
                setRequestMode((prev) => !prev);
              }}
              whiteBg
            /> */}
          </div>
          <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "transfer_requests" ? (
            <ProductTransferRequests />
          ) : activeTab === "requests" ? (
            <ProductRequests />
          ) : (
            <>
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
                          requestMode
                            ? handleRequestProductsUpdate({
                                productId: e?.id,
                                quantity: 1,
                              })
                            : handleEdit(e);
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
            </>
          )}

          {!isEmpty(requestProducts) && requestMode && (
            <Button
              text={`Request ${requestProducts?.length} ${
                requestProducts?.length === 1 ? "Product" : "Products"
              } `}
              onClick={() =>
                setCurrentTxnDetails({ modalType: REQUEST_PRODUCT })
              }
              isDisabled={isEmpty(requestProducts)}
              className="fixed z-[200] bottom-[54.67px] left-0 right-0 mx-auto w-fit"
            />
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
InventoryPage.propTypes = {
  handleProductSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
};
export default observer(InventoryPage);
