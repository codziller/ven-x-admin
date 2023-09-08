/* eslint-disable prettier/prettier */
import { useState } from "react";
import _ from "lodash";
import { capitalizeString } from "utils/formatter";

export default function useTableFilter({
  defaultFilters,
  defaultExportFilters,
  setFilterModal,
  currentPage,
  setCurrentPage,
  params,
}) {
  const [filterInput, setFilterInput] = useState(
    !_.isEmpty(params)
      ? {
          ...defaultFilters,
          ...params,

          account_status: params.account_status
            ? {
                name: capitalizeString(params.account_status),
                label: capitalizeString(params.account_status),
                value: params.account_status,
              }
            : "",
        }
      : defaultFilters
  );
  const [filterData, setFilterData] = useState(
    !_.isEmpty(params)
      ? {
          ...defaultFilters,
          ...params,

          account_status: params.account_status
            ? {
                name: capitalizeString(params.account_status),
                label: capitalizeString(params.account_status),
                value: params.account_status,
              }
            : "",
        }
      : defaultFilters
  );
  const [exportInput, setExportInput] = useState(defaultExportFilters);
  const hasChanged = !_.isEqual(defaultFilters, filterInput);

  const handleFilter = () => {
    if (hasChanged) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      setFilterData(filterInput);
      setFilterModal(false);
    } else {
      setFilterModal(false);
    }
  };

  const clearFilters = () => {
    if (!_.isEqual(defaultFilters, filterInput)) {
      setFilterData(defaultFilters);
      setFilterInput(defaultFilters);
      setCurrentPage(1);
      setFilterModal(false);
    }
  };

  const onRemoveFilter = (filter) => {
    setFilterData({
      ...filterData,
      [filter]: defaultFilters[filter],
    });
    setFilterInput({
      ...filterData,
      [filter]: defaultFilters[filter],
    });
  };

  return {
    filterInput,
    setFilterInput,
    setFilterData,
    filterData,
    handleFilter,
    clearFilters,
    onRemoveFilter,
    hasChanged,
    exportInput,
    setExportInput,
  };
}
