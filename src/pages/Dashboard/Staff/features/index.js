import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";
import qs from "query-string";

import useTableFilter from "hooks/tableFilter";
import ActiveFilter from "components/General/ActiveFilter";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";

import { pageCount, staffs } from "utils/appConstant";
import { hasValue } from "utils/validations";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as CsvIcon } from "assets/icons/csv-icon.svg";

import useWindowDimensions from "hooks/useWindowDimensions";

import { paramsObjectToQueryString } from "utils/request";
import { transactionAmount } from "utils/transactions";
import TransactionDetailsModal from "./DetailsModal";
import SearchBar from "components/General/Searchbar/SearchBar";
import { Button } from "components/General/Button";
import TableDropdown from "components/General/Dropdown/TableDropdown";

const options = [
  {
    value: "Admin",
    label: "Admin",
  },
  {
    value: "Basic Staff",
    label: "Basic Staff",
  },
];
export default function StaffPage() {
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

  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const searching = "";

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
      name: "Name",
      minWidth: isMobile ? "50%" : "35%",
      selector: (row) => (
        <div
          onClick={() => setCurrentTxnDetails({ ...row, modalType: "edit" })}
          className="py-4 mt-[5px] mb-[5px] flex-col justify-start items-start gap-1 flex"
        >
          <div className="text-black text-sm font-medium font-700">
            {row.name}
          </div>
          <div className="text-grey text-sm font-normal">{row.email}</div>
        </div>
      ),
      sortable: false,
    },

    {
      name: "Role",
      selector: (row) => <TableDropdown options={options} content={row.role} />,
      sortable: false,
    },

    {
      name: "Last Active",
      selector: (row) => moment(row.date).fromNow(),
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
            Delete
          </span>

          <span
            onClick={() => setCurrentTxnDetails({ ...row, modalType: "edit" })}
            className=" cursor-pointer px-4 py-1 rounded-full bg-black text-[11px] text-white "
          >
            Edit
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

  useEffect(() => scrollToTop(), [staffs]);

  return (
    <>
      <div className="h-full md:pr-4">
        <div className="flex flex-col justify-start items-start h-full w-full gap-y-5">
          <div className="flex flex-col md:flex-row justify-between items-center w-full mb-3 gap-1">
            <div className="w-full sm:w-[45%] sm:min-w-[300px]">
              <SearchBar
                placeholder={"Search for a product"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>

            <div className="hidden md:flex justify-end items-center w-fit gap-3">
              <Button
                text="Import CSV"
                icon={<CsvIcon className="" />}
                className="hidden md:block"
                whiteBg
              />
              <Button
                text="Add New Staff"
                icon={<Plus className="stroke-current" />}
                className="hidden md:block"
                onClick={() =>
                  setCurrentTxnDetails({ modalType: "add", isAdd: true })
                }
              />
            </div>
          </div>

          {searching ? (
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
                {staffs?.length > 0 ? (
                  <Table
                    data={staffs?.length ? staffs.slice(0, pageCount) : []}
                    columns={width >= 640 ? columns : columns.slice(0, 2)}
                    onRowClicked={(e) => {
                      setCurrentTxnDetails({ ...e, modalType: "edit" });
                    }}
                    pointerOnHover
                    isLoading={searching}
                    pageCount={staffs?.length / pageCount}
                    onPageChange={(page) => setCurrentPage(page)}
                    currentPage={currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      <span>Search for staffs</span>
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
}
