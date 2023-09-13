/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "components/General/Button/Button";
import { ReactComponent as Plus } from "assets/icons/Plus/plus.svg";
import { ReactComponent as NewPlus } from "assets/icons/Plus/new_plus.svg";
import { ReactComponent as BigPlus } from "assets/icons/Plus/big-plus.svg";
import { ReactComponent as Logout } from "assets/icons/Log_Out.svg";
import SearchBar from "components/General/Searchbar/SearchBar";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Pagination from "components/General/Pagination";
import { pageCount } from "utils/appConstant";
import WareHousesStore from "../store";
import SwitchProviderModal from "./SwitchProviderModal";
import ProviderCard from "./ProviderCard";
import { observer } from "mobx-react-lite";
import EmptyList from "./EmptyList";
import { getUserInfoFromStorage } from "utils/storage";
import { groupBy } from "lodash";
import { useAuth } from "hooks/useAuth";
import Tabs from "components/General/Tabs";

const TABS = ["Warehouses", "Archived warehouses"];

const ListOfProviders = () => {
  const navigate = useNavigate();
  const {
    getWarehouses,
    warehouses,
    warehousesCount,
    loading,
    getArchivedWarehouses,
    warehousesArchived,
    warehousesArchivedCount,
    loadingArchived,
  } = WareHousesStore;
  const { logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [searchQueryArchived, setSearchQueryArchived] = useState("");
  const [searchResultsArchived, setSearchResultsArchived] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const handleSearch = (value) => {
    const query = value?.toLowerCase();
    setSearchQuery(query);

    const filteredResults = warehouses.filter(
      ({ country, state }) =>
        country.toLowerCase().includes(query) ||
        state.toLowerCase().includes(query)
    );

    setSearchResults(filteredResults);
  };

  const handleSearchArchived = (value) => {
    const query = value?.toLowerCase();
    setSearchQueryArchived(query);

    const filteredResults = warehousesArchived.filter(
      ({ country, state }) =>
        country.toLowerCase().includes(query) ||
        state.toLowerCase().includes(query)
    );

    setSearchResultsArchived(filteredResults);
  };
  const { user } = getUserInfoFromStorage();

  useEffect(() => {
    getWarehouses({ data: { page: currentPage } });
  }, [currentPage]);

  useEffect(() => {
    getArchivedWarehouses({ data: { page: currentPageArchived } });
  }, [currentPageArchived]);

  useEffect(() => {
    setSearchResults(warehouses);
  }, [warehouses]);

  useEffect(() => {
    setSearchResultsArchived(warehousesArchived);
  }, [warehousesArchived]);

  const handleCreateProvider = () => {
    navigate("/warehouses/create_warehouse");
  };

  const groupedWarehouses = groupBy(warehouses, "state");

  return (
    <div className="flex-col justify-start items-center gap-8 inline-flex w-full sm:w-[560px] md:w-[660px] lg:w-[850px] h-full">
      <div
        onClick={handleCreateProvider}
        className="fixed cursor-pointer md:hidden z-[200] h-[65.33px] flex items-center justify-center w-[65.33px] rounded-[50%] bg-blue bottom-[54.67px] right-[10.67px]"
      >
        <BigPlus className="stroke-white" />
      </div>

      <div className="flex-col justify-start items-center gap-1 flex">
        <div className="text-slate-600 text-lg font-thin leading-[30px] tracking-wider">
          Welcome {user?.firstName}!{" "}
        </div>
        <h3 className="text-black text-[22px] leading-9 font-700">
          Manage Warehouses and Products
        </h3>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === TABS[0] && (
        <>
          {loading ? (
            <CircleLoader blue />
          ) : warehouses?.length ? (
            <>
              <div className="sm:p-10 w-full sm:bg-white rounded-lg sm:border border-grey-bordercolor flex-col justify-start items-center gap-10 flex">
                <div className="pb-[63px] flex-col justify-start items-end gap-6 flex w-full sm:w-auto">
                  <div className="justify-start items-start w-full inline-flex">
                    <div className="h-11 relative flex-col justify-start items-start flex w-full sm:w-[50%] sm:min-w-[350px]">
                      <SearchBar
                        placeholder="Search warehouses by state or region"
                        onChange={handleSearch}
                        value={searchQuery}
                        className="!flex"
                      />
                    </div>
                    <div className="w-full justify-end items-end hidden md:flex">
                      <Button
                        onClick={handleCreateProvider}
                        text="Add New Warehouse"
                        icon={<Plus className="stroke-current" />}
                      />
                    </div>
                  </div>

                  <div className="flex-col justify-start items-start gap-4 flex w-full sm:w-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-start items-center gap-4 w-full sm:w-auto">
                      {searchResults.map((provider, i) => (
                        <ProviderCard
                          key={provider.id}
                          provider={provider}
                          setModalVisible={setModalVisible}
                          group={groupedWarehouses[provider.state]}
                        />
                      ))}
                      <div
                        onClick={handleCreateProvider}
                        className="cursor-pointer w-full h-[152px] px-[127px] py-16 bg-stone-50 rounded-lg border border-grey-border hover:border-blue transition-colors duration-500 ease-in-out flex-col justify-center items-center gap-2.5 inline-flex"
                      >
                        <NewPlus className="stroke-current" />
                      </div>
                    </div>

                    <Pagination
                      pageCount={Number(warehousesCount) / pageCount}
                      onPageChange={(page) => setCurrentPage(page)}
                      currentPage={currentPage}
                    />
                  </div>
                </div>
                <div
                  onClick={logout}
                  className="justify-start items-center gap-2.5 inline-flex cursor-pointer"
                >
                  <div className="text-red-deep text-base font-medium">
                    Sign Out
                  </div>
                  <Logout className="stroke-current" />
                </div>
              </div>
              <SwitchProviderModal
                active={modalVisible}
                onClose={() => setModalVisible(false)}
              />
            </>
          ) : (
            <EmptyList handleCreateProvider={handleCreateProvider} />
          )}
        </>
      )}
      {activeTab === TABS[1] && (
        <>
          {loading ? (
            <CircleLoader blue />
          ) : warehouses?.length ? (
            <>
              <div className="sm:p-10 w-full sm:bg-white rounded-lg sm:border border-grey-bordercolor flex-col justify-start items-center gap-10 flex">
                <div className="pb-[63px] flex-col justify-start items-end gap-6 flex w-full sm:w-auto">
                  <div className="justify-start items-start w-full inline-flex">
                    <div className="h-11 relative flex-col justify-start items-start flex w-full sm:w-[50%] sm:min-w-[350px]">
                      <SearchBar
                        placeholder="Search warehouses by state or region"
                        onChange={handleSearchArchived}
                        value={searchQueryArchived}
                        className="!flex"
                      />
                    </div>
                    <div className="w-full justify-end items-end hidden md:flex">
                      <Button
                        onClick={handleCreateProvider}
                        text="Add New Warehouse"
                        icon={<Plus className="stroke-current" />}
                      />
                    </div>
                  </div>

                  <div className="flex-col justify-start items-start gap-4 flex w-full sm:w-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-start items-center gap-4 w-full sm:w-auto">
                      {searchResultsArchived.map((provider, i) => (
                        <ProviderCard
                          key={provider.id}
                          provider={provider}
                          setModalVisible={setModalVisible}
                        />
                      ))}
                      <div
                        onClick={handleCreateProvider}
                        className="cursor-pointer w-full h-[152px] px-[127px] py-16 bg-stone-50 rounded-lg border border-grey-border hover:border-blue transition-colors duration-500 ease-in-out flex-col justify-center items-center gap-2.5 inline-flex"
                      >
                        <NewPlus className="stroke-current" />
                      </div>
                    </div>

                    <Pagination
                      pageCount={Number(warehousesArchivedCount) / pageCount}
                      onPageChange={(page) => setCurrentPageArchived(page)}
                      currentPage={currentPageArchived}
                    />
                  </div>
                </div>
                <div
                  onClick={logout}
                  className="justify-start items-center gap-2.5 inline-flex cursor-pointer"
                >
                  <div className="text-red-deep text-base font-medium">
                    Sign Out
                  </div>
                  <Logout className="stroke-current" />
                </div>
              </div>
              <SwitchProviderModal
                active={modalVisible}
                onClose={() => setModalVisible(false)}
              />
            </>
          ) : (
            <EmptyList handleCreateProvider={handleCreateProvider} />
          )}
        </>
      )}
    </div>
  );
};
export default observer(ListOfProviders);
