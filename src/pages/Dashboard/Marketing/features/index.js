import React, { useEffect, useState } from "react";
import _ from "lodash";

import TransactionDetailsModal from "./DetailsModal";
import Tabs from "components/General/Tabs";
import HomePageSlider from "./HomePageSlider";
import HomePagePost from "./HomePagePost";
import MobilePagePost from "./MobilePagePost";
import PromoBanner from "./PromoBanner";
import MobileMarketingImage from "./MobileMarketingImage";
import Discount from "./Discount";
import MobileBrandsOfTheMoment from "./MobileBrandsOfTheMoment";
import WebMarketingImage from "./WebMarketingImage";
import { useParams, useLocation } from "react-router-dom";

const MarketingPage = () => {
  const { warehouse_id } = useParams();
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get("tab");
  console.log("currentTab: ", currentTab);
  const TABS = [
    { name: "homePageSliders", label: "Home Page Sliders" },
    { name: "homePagePosts", label: "Home Page Posts" },
    {
      name: "mobilePagePosts",
      label: "Mobile Page Sliders",
    },
    {
      name: "mobileMarketingImages",
      label: "Mobile Marketing Images",
    },
    {
      name: "mobileBrandsOfTheMoment",
      label: "Mobile Brands Of The Moment",
    },
    {
      name: "promoBanners",
      label: "Promo Banners",
    },

    {
      name: "webMarketingImage",
      label: "Web Marketing Images",
    },
    {
      name: "discounts",
      label: "Discounts",
    },
  ];

  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToTop(), [activeTab]);

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  return (
    <>
      <div className="h-full w-full md:pr-4 md:px-4">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5 mt-5">
          <Tabs
            baseUrl={`/dashboard/marketing/${warehouse_id}/`}
            tabs={TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {activeTab === TABS[0].name ? <HomePageSlider /> : null}
          {activeTab === TABS[1].name ? <HomePagePost /> : null}
          {activeTab === TABS[2].name ? <MobilePagePost /> : null}
          {activeTab === TABS[3].name ? <MobileMarketingImage /> : null}
          {activeTab === TABS[4].name ? <MobileBrandsOfTheMoment /> : null}
          {activeTab === TABS[5].name ? <PromoBanner /> : null}
          {activeTab === TABS[6].name ? <WebMarketingImage /> : null}
          {activeTab === TABS[7].name ? <Discount /> : null}
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
export default MarketingPage;
