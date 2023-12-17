import React, { useEffect, useMemo, useState } from "react";
import _, { isEmpty } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";

import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { pageCount } from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { numberWithCommas } from "utils/formatter";
import Amount from "components/General/Numbers/Amount";
import Tabs from "components/General/Tabs";
import ProductsStore from "pages/Dashboard/Products/store";
import { Button } from "components/General/Button";

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
const ReviewsPage = ({ isModal, handleUserSelect }) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const { getReviews, reviews, reviewsLoading, reviewsCount } = ProductsStore;
  const searchResult = [];
  const searchResultCount = 0;
  const searchUserLoading = false;
  const TABS = [{ name: "reviews", label: `Reviews (${reviewsCount || "-"})` }];
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [searchInput] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);
  const searchQuery = searchInput?.trim();
  const isSearchMode = searchQuery?.length > 1;
  const isArchive = activeTab === TABS?.[1]?.name;

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }
  };

  const handleGetData = () => {
    getReviews({ data: { page: currentPage } });
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
      handleUserSelect(row);
      return;
    }
  };
  const columns = [
    {
      name: "Name",
      minWidth: isMobile ? "50%" : "30%",
      selector: (row) => (
        <div
          onClick={() => handleEdit(row)}
          className="py-4 mt-[5px] mb-[5px] flex-col justify-start items-start gap-1 flex"
        >
          <div className="text-black text-sm font-medium font-700">
            {row?.firstName} {row?.lastName}
          </div>
          <div className="text-grey text-sm font-normal">{row.email}</div>
        </div>
      ),
      sortable: false,
    },

    {
      name: "Phone Number",
      selector: "phoneNumber",
      sortable: false,
    },
    {
      name: "Role",
      selector: (row) => (
        <span onClick={() => handleEdit(row)}>{row?.role}</span>
      ),
      sortable: false,
    },

    {
      name: "Wallet Balance",
      selector: (row) => (
        <Amount value={row?.balance} onClick={() => handleEdit(row)} />
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
            {row?.isDeleted ? "Unarchive" : "Archive"}
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

  const displayedReviews = useMemo(() => {
    return isSearchMode ? searchResult : isArchive ? [] : reviews;
  }, [searchResult, reviews, isSearchMode, isArchive]);

  const displayedReviewsCount = useMemo(() => {
    return isSearchMode ? searchResultCount : isArchive ? [] : reviewsCount;
  }, [searchResult, reviews, isSearchMode]);

  const isLoading = useMemo(() => {
    return isSearchMode
      ? searchUserLoading
      : isArchive
      ? false
      : isEmpty(reviews) && reviewsLoading;
  }, [searchUserLoading, reviewsLoading]);

  useEffect(() => scrollToTop(), [displayedReviews]);

  return (
    <>
      <div className={classNames("h-full w-full", { "md:pr-4": !isModal })}>
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          {isLoading ? (
            <CircleLoader blue />
          ) : (
            <>
              {isSearchMode &&
                `Search results - ${numberWithCommas(searchResultCount)}`}
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {!isEmpty(displayedReviews) ? (
                  <Table
                    data={displayedReviews}
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
                    pageCount={displayedReviewsCount / pageCount}
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
                            ? "There are currently no archived reviews"
                            : "There are currently no reviews"}
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

ReviewsPage.propTypes = {
  handleUserSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
};

export default observer(ReviewsPage);
