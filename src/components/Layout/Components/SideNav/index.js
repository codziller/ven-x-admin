import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "classnames";
import { Link, useParams } from "react-router-dom";

import { trimArrayOfObject } from "utils/formatter";
import { ReactComponent as Overview } from "assets/icons/overview.svg";
import { ReactComponent as Products } from "assets/icons/products.svg";
import { ReactComponent as Staff } from "assets/icons/staff.svg";
import { ReactComponent as Gallery } from "assets/icons/gallery.svg";
import Logo from "assets/icons/logo--name.svg";

import { ReactComponent as LogoSmall } from "assets/logos/logo-purple.svg";
import { TbBrandDenodo, TbCategory2, TbPackageImport } from "react-icons/tb";
import {
  PiArrowsInLineVerticalDuotone,
  PiArrowsOutLineHorizontalDuotone,
  PiUsersThree,
} from "react-icons/pi";
import BackDrop from "components/Layout/BackDrop";
import ProviderCard from "./ProviderCard";
import {
  MdOutlineCardGiftcard,
  // MdOutlineForwardToInbox,
  MdOutlineInventory,
  MdOutlinePayments,
  MdOutlinePeopleAlt,
  MdOutlineRemoveShoppingCart,
  // MdOutlineStorage,
  MdOutlineReviews,
} from "react-icons/md";
import { FcBusinesswoman } from "react-icons/fc";

import WareHousesStore from "pages/Dashboard/WareHouses/store";
import ProductsStore from "pages/Dashboard/Plans/store";
import { observer } from "mobx-react-lite";
import { getUserInfoFromStorage } from "utils/storage";
import { GiReceiveMoney } from "react-icons/gi";
import AuthStore from "pages/OnBoarding/SignIn/store";
import BrandsStore from "pages/Dashboard/Brands/store";

const getLinks = (warehouse_id, user, userIsAdmin) => [
  {
    title: "Overview",
    heading: `Welcome, ${user?.firstName}`,
    label: "Here’s what’s happening with Ven-x today.",
    slug: "/dashboard/home",
    link: `/dashboard/home/${warehouse_id}`,
    icon: (
      <Overview className="stroke-current fill-current sidenav-item  transition-all duration-500 ease-in-out" />
    ),
  },

  ...(userIsAdmin
    ? [
        {
          title: "Jobs",
          slug: "/dashboard/jobs",
          label: "Here’s what’s happening with Ven-x today.",
          link: `/dashboard/jobs/${warehouse_id}`,
          icon: (
            <TbPackageImport
              size={24}
              className="stroke-current transition-all duration-500 ease-in-out"
            />
          ),
        },

        {
          title: "Events",
          slug: "/dashboard/events",
          label: "Here’s what’s happening with Ven-x today.",
          link: `/dashboard/events/${warehouse_id}`,
          icon: (
            <TbPackageImport
              size={24}
              className="stroke-current transition-all duration-500 ease-in-out"
            />
          ),
        },

        {
          title: "Plans",
          label: "Here’s what’s happening with Ven-x today.",
          link: `/dashboard/plans/${warehouse_id}`,
          slug: "/dashboard/plans",
          icon: (
            <Products className="stroke-current fill-current sidenav-item  transition-all duration-500 ease-in-out" />
          ),
        },
        {
          title: "Reports",
          slug: "/dashboard/reviews",
          label: "Here’s what’s happening with Ven-x today.",
          link: `/dashboard/reviews/${warehouse_id}`,
          icon: (
            <MdOutlineReviews
              size={24}
              className="stroke-current transition-all duration-500 ease-in-out"
            />
          ),
        },

        {
          title: "Payments",
          slug: "/dashboard/payments",
          label: "Here’s what’s happening with Ven-x today.",
          link: `/dashboard/payments/${warehouse_id}`,
          icon: (
            <MdOutlinePayments
              size={24}
              className="stroke-current transition-all duration-500 ease-in-out"
            />
          ),
        },
        {
          title: "Staff",
          slug: "/dashboard/staffs",
          heading: "Manage Staffs",
          label: "Here’s what’s happening with Ven-x today.",
          link: `/dashboard/staffs/${warehouse_id}`,
          icon: (
            <Staff className="stroke-current fill-current sidenav-item  transition-all duration-500 ease-in-out" />
          ),
        },
        {
          title: "Clients",
          slug: "/dashboard/clients",
          heading: "Manage Users",
          label: "Here’s what’s happening with Ven-x today.",
          link: `/dashboard/clients/${warehouse_id}`,
          icon: (
            <PiUsersThree
              size={24}
              className="stroke-current transition-all duration-500 ease-in-out"
            />
          ),
        },

        {
          title: "Vendors",
          slug: "/dashboard/clients",
          heading: "Manage Users",
          label: "Here’s what’s happening with Ven-x today.",
          link: `/dashboard/clients/${warehouse_id}`,
          icon: (
            <PiUsersThree
              size={24}
              className="stroke-current transition-all duration-500 ease-in-out"
            />
          ),
        },

        {
          title: "Settings",
          slug: "/dashboard/settings",
          label: "Here’s what’s happening with Ven-x today.",
          link: `/dashboard/settings/${warehouse_id}/?tab=pushNotifications`,
          icon: (
            <Gallery className="stroke-current fill-current sidenav-item  transition-all duration-500 ease-in-out" />
          ),
        },
      ]
    : []),
];

const SideNav = ({
  sidenavOpen,
  setSidenavOpen,
  withBackDrop,
  sidenavCollapsed,
  setSidenavCollapsed,
}) => {
  const { warehouse_id } = useParams();
  const { user } = getUserInfoFromStorage();
  const { userIsAdmin, userIsBrandStaff } = AuthStore;
  const { getBrand, getBrandLoading, brand } = BrandsStore;
  const links = useMemo(
    () => getLinks(warehouse_id, user, userIsAdmin),
    [warehouse_id, user, userIsAdmin]
  );

  const { getWarehouse, warehouse, getWareHouseLoading } = WareHousesStore;
  const { resetProductStore } = ProductsStore;
  useEffect(() => {
    // warehouse_id && userIsAdmin && getWarehouse({ data: { id: warehouse_id } });
  }, [warehouse_id, location.pathname, userIsAdmin]);
  useEffect(() => {
    // warehouse_id &&
    //   userIsBrandStaff &&
    //   getBrand({ data: { id: warehouse_id } });
  }, [warehouse_id, location.pathname, userIsBrandStaff]);

  const handleLinks = (url) => {
    return {
      to: url,
    };
  };

  const brandName = brand?.brandName;
  return (
    <>
      {withBackDrop && (
        <BackDrop
          active={sidenavOpen}
          onClick={() => setSidenavOpen(!sidenavOpen)}
          className="z-[9996]"
        />
      )}
      <aside
        className={clsx(
          `sidenav left-0 z-[9997] h-screen md:py-4 flex flex-col flex-grow  transition-transform duration-150 ease-in-out overflow-y-auto border-r border-grey-bordercolor`,
          { "w-[100px]": sidenavCollapsed, "w-[250px]": !sidenavCollapsed },
          { "translate-x-[0]": sidenavOpen },
          { "-translate-x-[250px]": !sidenavOpen },
          { "lg:hidden !mt-0 h-screen": withBackDrop },
          "lg:translate-x-0 fixed bg-black z-[9997]"
        )}
      >
        <div className="bg-grey-dark3 w-full mb-2">
          <div className="pl-9 pr-3.5 py-3.5 flex flex-col justify-start items-start gap-1 w-full overflow-hidden">
            <div className="flex text-white">
              <span className=" text-xl font-600">
                {sidenavCollapsed ? (
                  <span className="scale-50">
                    <LogoSmall />
                  </span>
                ) : (
                  <img alt="logo" src={Logo} className="w-[120px] h-[60px]" />
                )}
              </span>
            </div>

            {userIsBrandStaff ? (
              <span className="text-white text-base">
                {sidenavCollapsed
                  ? brandName?.substring(0, 2)
                  : brandName + " Dashboard"}
              </span>
            ) : (
              <span className="text-grey-23 text-base">
                {sidenavCollapsed ? "AD" : "Admin Dashboard"}
              </span>
            )}
          </div>
        </div>

        <span
          onClick={() => setSidenavCollapsed(!sidenavCollapsed)}
          className="text-white ml-auto mr-6 mb-2 cursor-pointer p-3 rounded-full hover:bg-grey-dark3 transition-colors duration-300 ease-in-out"
        >
          {sidenavCollapsed ? (
            <PiArrowsOutLineHorizontalDuotone
              size={22}
              className="fill-current"
            />
          ) : (
            <PiArrowsInLineVerticalDuotone
              size={22}
              className="fill-current rotate-90 "
            />
          )}
        </span>
        <div className="w-full md:h-full space-y-[21px] md:space-y-6 pb-[15px] pr-4">
          <div className=" flex flex-col justify-start items-start pl-3 md:pl-6 w-full cursor-pointer transition-all duration-1000 ease-in-out pb-28">
            {trimArrayOfObject(links).map(({ title, icon, link, slug }) => (
              <>
                <Link key={title} {...handleLinks(link)}>
                  <div
                    className={`flex justify-center mt-5 items-center hover:translate-x-3 hover:text-grey-text text-grey-text6 text-sm space-x-2 font-semibold transition-all duration-300 ease-in-out ${
                      location?.pathname?.includes(slug || link) &&
                      "!text-white"
                    }`}
                  >
                    {icon}
                    {!sidenavCollapsed && (
                      <span className="text-current text-base md:text-lg capitalize transition-all duration-500 ease-in-out">
                        {title}
                      </span>
                    )}
                  </div>
                </Link>
              </>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

SideNav.propTypes = {
  sidenavOpen: PropTypes.bool,
  withBackDrop: PropTypes.bool,
  setSidenavOpen: PropTypes.func,
  sidenavCollapsed: PropTypes.bool,
  setSidenavCollapsed: PropTypes.func,
};
export { getLinks };
export default observer(SideNav);
