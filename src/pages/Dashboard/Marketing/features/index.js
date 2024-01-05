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
import MarketingTextInput from "./MarketingTextInput";
import WebLinkMarketingImage from "./WebLinkMarketingImage";
import PushNotification from "./PushNotification";

const MarketingPage = () => {
  const { warehouse_id } = useParams();
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get("tab");
  console.log("currentTab: ", currentTab);
  const TABS = [
    { name: "pushNotifications", label: "Push Notifications" },
    {
      name: "appSettings",
      label: "App Settings",
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
            baseUrl={`/dashboard/settings/${warehouse_id}/`}
            tabs={TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {activeTab === "pushNotifications" ? <PushNotification /> : null}
          {activeTab === "appSettings" ? <MarketingTextInput /> : null}
          {activeTab === "homePagePosts" ? <HomePagePost /> : null}
          {activeTab === "mobilePagePosts" ? <MobilePagePost /> : null}
          {activeTab === "mobileMarketingImages" ? (
            <MobileMarketingImage />
          ) : null}
          {activeTab === "webLinkMarketingImages" ? (
            <WebLinkMarketingImage />
          ) : null}
          {activeTab === "mobileBrandsOfTheMoment" ? (
            <MobileBrandsOfTheMoment />
          ) : null}
          {activeTab === "promoBanners" ? <PromoBanner /> : null}
          {activeTab === "webMarketingImage" ? <WebMarketingImage /> : null}
          {activeTab === "discounts" ? <Discount /> : null}
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
