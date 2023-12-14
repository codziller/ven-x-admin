import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { isEmpty, lowerCase } from "lodash";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import ProductsStore from "pages/Dashboard/Products/store";
import { dateFilters } from "pages/Dashboard/Home/features";
import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import DateRangeModal from "components/General/Modal/DateRangeModal/DateRangeModal";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { convertToJs } from "utils/functions";
import { numberWithCommas } from "utils/formatter";
import Table from "components/General/Table";
import BrandsStore from "../store";
import Amount from "components/General/Numbers/Amount";
import SearchBar from "components/General/Searchbar/SearchBar";
const ViewBrand = () => {
  const pageCount = 10000000;
  const { brand_id } = useParams();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const {
    getProductQuantitySoldByDateFilterByBrandId,
    brandProductStats,
    loadingBrandProductStats,
  } = ProductsStore;
  console.log("brandProductStats: ", convertToJs(brandProductStats));
  const { getBrand, getBrandLoading, brand } = BrandsStore;

  useEffect(() => {
    if (!brand_id) return;
    getBrand({ data: { id: brand_id } });
  }, [brand_id]);

  useEffect(() => {
    const endDate = moment(dateFilter.end_date)
      .add(1, "day")
      .format("YYYY-MM-DD");
    getProductQuantitySoldByDateFilterByBrandId({
      data: {
        endDate,
        brandId: brand_id,
        startDate: moment(dateFilter.start_date).format("YYYY-MM-DD"),
      },
    });
  }, [dateFilter, brand_id]);

  useEffect(() => {
    if (!brandProductStats) return;
    setDisplayedItems(brandProductStats);
  }, [brandProductStats]);

  const searchQuery = useMemo(() => {
    return searchInput?.trim();
  }, [searchInput]);

  useEffect(() => {
    if (!searchQuery) {
      setDisplayedItems(brandProductStats);
      return;
    }
    const searchResult = convertToJs(brandProductStats)?.filter((item) =>
      lowerCase(item?.productName).includes(searchQuery.toLowerCase())
    );
    setDisplayedItems(searchResult);
  }, [searchQuery]);
  const columns = [
    {
      minWidth: "30%",
      name: "Product",
      selector: (row) => lowerCase(row?.productName),
      cell: (row) => row?.productName,
      sortable: true,
    },

    {
      name: "Quantity Sold",
      selector: (row) => Number(row?.quantitySold),
      cell: (row) => numberWithCommas(row?.quantitySold),
      sortable: true,
    },
    {
      name: "Quantity Left",
      selector: (row) => Number(row?.quantityLeft),
      cell: (row) => numberWithCommas(row?.quantityLeft),
      sortable: true,
    },
    {
      name: "Cost Price",
      selector: (row) => parseFloat(row?.costPrice),
      cell: (row) => (
        <div className="flex justify-start items-center gap-4">
          <Amount value={row?.costPrice} />
        </div>
      ),
      sortable: true,
    },

    {
      name: "Sale Price",
      selector: (row) => parseFloat(row?.salePrice),
      cell: (row) => (
        <div className="flex justify-start items-center gap-4">
          <Amount value={row?.salePrice} />
        </div>
      ),
      sortable: true,
    },

    {
      name: "Profit",
      selector: (row) => parseFloat(row?.profit),
      cell: (row) => (
        <div className="flex justify-start items-center gap-4">
          <Amount value={row?.profit} />
        </div>
      ),
      sortable: true,
    },
  ];

  const displayedItemsCount = brandProductStats?.length || 0;

  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
        <div className="mb-5 w-full flex justify-between">
          <div onClick={() => navigate(-1)} className="scale-90 cursor-pointer">
            <ArrowBack />
          </div>
        </div>

        {getBrandLoading ? (
          <div className="flex justify-center items-center w-full p-6">
            <CircleLoader blue />
          </div>
        ) : (
          <>
            <h2 className="section-heading mb-3 text-xl">
              <span className="text-red">{brand?.brandName} </span>sales data
              history
            </h2>

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

            <div className="w-full sm:w-[45%] sm:min-w-[300px]">
              <SearchBar
                placeholder={"Search for a product"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-4 mt-4">
              {loadingBrandProductStats ? (
                <CircleLoader blue />
              ) : (
                <>
                  <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                    {!isEmpty(displayedItems) ? (
                      <Table
                        data={displayedItems}
                        columns={columns}
                        pageCount={displayedItemsCount / pageCount}
                        tableClassName="txn-section-table"
                        noPadding
                      />
                    ) : (
                      <>
                        <div className="text-sm text-grey flex flex-col justify-center items-center space-y-3 h-full">
                          Sales data history for this brand is currency empty
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

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
ViewBrand.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
export default observer(ViewBrand);
