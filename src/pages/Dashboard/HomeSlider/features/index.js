import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";
import qs from "query-string";
import { Link } from "react-router-dom";

import useTableFilter from "hooks/tableFilter";
import ActiveFilter from "components/General/ActiveFilter";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { promos } from "utils/appConstant";
import { hasValue } from "utils/validations";
import { ReactComponent as NewPlus } from "assets/icons/Plus/new_plus.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import { paramsObjectToQueryString } from "utils/request";
import TransactionDetailsModal from "./DetailsModal";
import SearchBar from "components/General/Searchbar/SearchBar";
import { Button } from "components/General/Button";
import TableDropdown from "components/General/Dropdown/TableDropdown";

const options = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Expired",
    label: "Expired",
  },
];
export default function HomeSliderPage() {
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
      name: "Promo Code",
      selector: "code",
      sortable: false,
    },

    {
      name: "Status",
      selector: (row) => (
        <TableDropdown options={options} content={row.status} />
      ),
      sortable: false,
    },

    {
      name: "Last Used",
      selector: (row) => moment(row.date).fromNow(),
      sortable: true,
    },

    {
      name: "Actions",

      selector: (row) => (
        <div className="flex justify-start items-center gap-1.5">
          <span
            onClick={() => setCurrentTxnDetails({ ...row, modalType: "edit" })}
            className=" cursor-pointer px-4 py-1 rounded-full bg-black text-[11px] text-white "
          >
            Edit
          </span>

          <span
            onClick={() =>
              setCurrentTxnDetails({ ...row, modalType: "delete" })
            }
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

  useEffect(() => scrollToTop(), [promos]);

  return (
    <>
      <div className="h-full md:pr-4 md:bg-white md:px-4">
        <div className="flex flex-col justify-start items-start h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <span className="text-black text-lg sm:text-xl font-700 my-5">
              Manage Home Slider Images
            </span>
          </div>

          {searching ? (
            <CircleLoader blue />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 smlg:grid-cols-4 justify-start items-center gap-4 w-full">
                <Link
                  to="/dashboard/slider-images/add-slider-images/warehouse_id"
                  className="flex justify-center items-center cursor-pointer w-full h-[125px] bg-[#F8F8F8] rounded-[7px] border-[0.8px] border-grey-border hover:border-blue transition-colors duration-500 ease-in-out gap-2.5"
                >
                  <NewPlus className="stroke-current" />
                </Link>
                <Link
                  to="/dashboard/slider-images/add-slider-images/warehouse_id"
                  className="flex justify-center items-center cursor-pointer w-full h-[125px] bg-[#F8F8F8] rounded-[7px] border-[0.8px] border-grey-border hover:border-blue transition-colors duration-500 ease-in-out gap-2.5"
                >
                  <NewPlus className="stroke-current" />
                </Link>
                <Link
                  to="/dashboard/slider-images/add-slider-images/warehouse_id"
                  className="flex justify-center items-center cursor-pointer w-full h-[125px] bg-[#F8F8F8] rounded-[7px] border-[0.8px] border-grey-border hover:border-blue transition-colors duration-500 ease-in-out gap-2.5"
                >
                  <NewPlus className="stroke-current" />
                </Link>
                <Link
                  to="/dashboard/slider-images/add-slider-images/warehouse_id"
                  className="flex justify-center items-center cursor-pointer w-full h-[125px] bg-[#F8F8F8] rounded-[7px] border-[0.8px] border-grey-border hover:border-blue transition-colors duration-500 ease-in-out gap-2.5"
                >
                  <NewPlus className="stroke-current" />
                </Link>
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
