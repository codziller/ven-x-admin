import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "components/ProtectedRoute";
import Home from "pages/Dashboard/Home";
import HomePage from "pages/Dashboard/Home/features";
import ProviderDashboard from "pages/Dashboard/WareHouses";
import ProvidersList from "pages/Dashboard/WareHouses/features/ProvidersList";
import CreateProvider from "pages/Dashboard/WareHouses/features/CreateProvider";
import Successful from "pages/Dashboard/WareHouses/features/Successful";
import SignIn from "pages/OnBoarding/SignIn/features";
import SignInPage from "pages/OnBoarding/SignIn";
import Logs from "pages/Dashboard/Log";
import ListOfLogs from "pages/Dashboard/Log/features";
import ProductsPage from "pages/Dashboard/Plans/features";
import Products from "pages/Dashboard/Plans";
import AddProduct from "pages/Dashboard/Plans/features/AddProduct";
import StaffPage from "pages/Dashboard/Staff/features";
import Staff from "pages/Dashboard/Staff";
import PromoPage from "pages/Dashboard/Promo/features";
import Promo from "pages/Dashboard/Promo";
import AddPromo from "pages/Dashboard/Promo/features/AddPromo";
import Marketing from "pages/Dashboard/Marketing";
import AddHomePageSlider from "pages/Dashboard/Marketing/features/AddHomePageSlider";
import MarketingPage from "pages/Dashboard/Marketing/features";
import FeaturedSectionPage from "pages/Dashboard/FeaturedSection/features";
import FeaturedSection from "pages/Dashboard/FeaturedSection";
import Orders from "pages/Dashboard/Jobs";
import OrdersPage from "pages/Dashboard/Jobs/features";

import Events from "pages/Dashboard/Events";
import EventsPage from "pages/Dashboard/Events/features";

import Inventory from "pages/Dashboard/Inventory";
import InventoryPage from "pages/Dashboard/Inventory/features";
import Categories from "pages/Dashboard/Categories";
import CategoriesPage from "pages/Dashboard/Categories/features";
import BackInStock from "pages/Dashboard/BackInStock";
import BackInStockPage from "pages/Dashboard/BackInStock/features";
import Brands from "pages/Dashboard/Brands";
import BrandsPage from "pages/Dashboard/Brands/features";
import BrandDetails from "pages/Dashboard/Brands/features/Brand";
import AbandonedCarts from "pages/Dashboard/AbandonedCarts";
import AbandonedCartsPage from "pages/Dashboard/AbandonedCarts/features";
import GiftCards from "pages/Dashboard/GiftCards";
import GiftCardsPage from "pages/Dashboard/GiftCards/features";
import AddGiftCards from "pages/Dashboard/GiftCards/features/AddForm";
import Subscriptions from "pages/Dashboard/Subscriptions";
import SubscriptionsPage from "pages/Dashboard/Subscriptions/features";
import Discounts from "pages/Dashboard/Discounts";
import DiscountsPage from "pages/Dashboard/Discounts/features";
import AddDiscounts from "pages/Dashboard/Discounts/features/AddForm";
import Referrals from "pages/Dashboard/Referrals";
import ReferralsPage from "pages/Dashboard/Referrals/features";
import Payments from "pages/Dashboard/Payments";
import PaymentsPage from "pages/Dashboard/Payments/features";
import AddMarketer from "pages/Dashboard/AffiliateMarketers/features/AddMarketer";
import AffiliateMarketers from "pages/Dashboard/AffiliateMarketers";
import AffiliateMarketersPage from "pages/Dashboard/AffiliateMarketers/features";
import Users from "pages/Dashboard/Users";
import UsersPage from "pages/Dashboard/Users/features";
import AddUser from "pages/Dashboard/Users/features/AddUser";
import Donations from "pages/Dashboard/Donations";
import DonationsPage from "pages/Dashboard/Donations/features";
import AddHomePagePost from "pages/Dashboard/Marketing/features/AddHomePagePost";
import AddMobilePagePost from "pages/Dashboard/Marketing/features/AddMobilePagePost";
import AddPromoBanner from "pages/Dashboard/Marketing/features/AddPromoBanner";
import AddMobileMarketingImage from "pages/Dashboard/Marketing/features/AddMobileMarketingImage";
import AddDiscount from "pages/Dashboard/Marketing/features/AddDiscount";
import AddStaff from "pages/Dashboard/Staff/features/AddStaff";
import AddMobileBrandsOfTheMoment from "pages/Dashboard/Marketing/features/AddMobileBrandsOfTheMoment";
import EditInventory from "pages/Dashboard/Inventory/features/EditInventory";
import AddWebMarketingImage from "pages/Dashboard/Marketing/features/AddWebMarketingImage";
import AddWebLinkMarketingImage from "pages/Dashboard/Marketing/features/AddWebLinkMarketingImage";
import Reviews from "pages/Dashboard/Reviews";
import ReviewsPage from "pages/Dashboard/Reviews/features";

const Router = () => {
  return (
    <>
      <Routes>
        {/* providers */}
        <Route
          path="/warehouses"
          element={
            <ProtectedRoute path="">
              <ProviderDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<ProvidersList />} />
          <Route
            path="/warehouses/create_warehouse"
            element={<CreateProvider />}
          />
          <Route path="/warehouses/successful" element={<Successful />} />
        </Route>
        {/* end providers */}

        {/* home */}
        <Route
          path="/dashboard/home"
          element={
            <ProtectedRoute path="">
              <Home />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<HomePage />} />
        </Route>
        {/* end home */}

        {/* products */}
        <Route
          path="/dashboard/plans"
          element={
            <ProtectedRoute path="">
              <Products />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<ProductsPage />} />
          <Route path="add/:warehouse_id" element={<AddProduct />} />
          <Route
            path="edit/:warehouse_id/:product_id"
            element={<AddProduct />}
          />
          <Route
            path="view/:warehouse_id/:product_id"
            element={<AddProduct />}
          />
        </Route>
        {/* end products */}

        {/* affiliate-marketers */}
        <Route
          path="/dashboard/affiliate-marketers"
          element={
            <ProtectedRoute path="">
              <AffiliateMarketers />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<AffiliateMarketersPage />} />
          <Route path="add/:warehouse_id" element={<AddMarketer />} />
          <Route
            path="edit/:warehouse_id/:affiliateMarketer_id"
            element={<AddMarketer />}
          />
        </Route>
        {/* end affiliate-marketers */}

        {/* donations */}
        <Route
          path="/dashboard/donations"
          element={
            <ProtectedRoute path="">
              <Donations />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<DonationsPage />} />
        </Route>
        {/* end affiliate-marketers */}

        {/* jobs */}
        <Route
          path="/dashboard/jobs"
          element={
            <ProtectedRoute path="">
              <Orders />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<OrdersPage />} />
        </Route>
        {/* end jobs */}

        {/* events */}
        <Route
          path="/dashboard/events"
          element={
            <ProtectedRoute path="">
              <Events />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<EventsPage />} />
        </Route>
        {/* end events */}

        {/* inventory */}
        <Route
          path="/dashboard/inventory"
          element={
            <ProtectedRoute path="">
              <Inventory />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<InventoryPage />} />
          <Route
            path="edit/:warehouse_id/:product_id"
            element={<EditInventory />}
          />
        </Route>
        {/* end inventory */}

        {/* brands */}
        <Route
          path="/dashboard/brands"
          element={
            <ProtectedRoute path="">
              <Brands />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<BrandsPage />} />
          <Route
            path="view/:warehouse_id/:brand_id"
            element={<BrandDetails />}
          />
        </Route>
        {/* end brands */}

        {/* reviews */}
        <Route
          path="/dashboard/reviews"
          element={
            <ProtectedRoute path="">
              <Reviews />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<ReviewsPage />} />
        </Route>
        {/* end reviews */}

        {/* categories */}
        <Route
          path="/dashboard/categories"
          element={
            <ProtectedRoute path="">
              <Categories />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<CategoriesPage />} />
        </Route>
        {/* end categories */}

        {/* back-in-stock */}
        <Route
          path="/dashboard/back-in-stock"
          element={
            <ProtectedRoute path="">
              <BackInStock />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<BackInStockPage />} />
        </Route>
        {/* end back-in-stock */}

        {/* abandoned-carts */}
        <Route
          path="/dashboard/abandoned-carts"
          element={
            <ProtectedRoute path="">
              <AbandonedCarts />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<AbandonedCartsPage />} />
        </Route>
        {/* end abandoned-carts */}

        {/* staff */}
        <Route
          path="/dashboard/staffs"
          element={
            <ProtectedRoute path="">
              <Staff />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<StaffPage />} />
          <Route path="add/:warehouse_id" element={<AddStaff />} />
          <Route path="edit/:warehouse_id/:staff_id" element={<AddStaff />} />
        </Route>
        {/* end staff */}

        {/* users */}
        <Route
          path="/dashboard/clients"
          element={
            <ProtectedRoute path="">
              <Users />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<UsersPage />} />
          <Route path="add/:warehouse_id" element={<AddUser />} />
          <Route path="edit/:warehouse_id/:user_id" element={<AddUser />} />
        </Route>
        {/* end users */}

        {/* promo */}
        <Route
          path="/dashboard/promo"
          element={
            <ProtectedRoute path="">
              <Promo />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<PromoPage />} />
          <Route path="add-promo/:warehouse_id" element={<AddPromo />} />
        </Route>
        {/* end promo */}

        {/* gift-cards */}
        <Route
          path="/dashboard/gift-cards"
          element={
            <ProtectedRoute path="">
              <GiftCards />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<GiftCardsPage />} />
          <Route
            path="add-gift-cards/:warehouse_id"
            element={<AddGiftCards />}
          />
        </Route>
        {/* end promo */}

        {/* discounts */}
        <Route
          path="/dashboard/discounts"
          element={
            <ProtectedRoute path="">
              <Discounts />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<DiscountsPage />} />
          <Route
            path="add-discounts/:warehouse_id"
            element={<AddDiscounts />}
          />
        </Route>
        {/* end discounts */}

        {/* referrals */}
        <Route
          path="/dashboard/referrals"
          element={
            <ProtectedRoute path="">
              <Referrals />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<ReferralsPage />} />
        </Route>
        {/* end referrals */}

        {/* subscriptions */}
        <Route
          path="/dashboard/subscriptions"
          element={
            <ProtectedRoute path="">
              <Subscriptions />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<SubscriptionsPage />} />
        </Route>
        {/* end subscriptions */}

        {/* payments */}
        <Route
          path="/dashboard/payments"
          element={
            <ProtectedRoute path="">
              <Payments />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<PaymentsPage />} />
        </Route>
        {/* end payments */}

        {/* media */}
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute path="">
              <Marketing />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<MarketingPage />} />
          <Route
            path="add-homepage-slider/:warehouse_id/:position"
            element={<AddHomePageSlider />}
          />
          <Route
            path="edit/:warehouse_id/:position/:media_id"
            element={<AddHomePageSlider />}
          />
          <Route
            path="add-homepage-post/:warehouse_id/:position"
            element={<AddHomePagePost />}
          />
          <Route
            path="edit-homepage-post/:warehouse_id/:position/:media_id"
            element={<AddHomePagePost />}
          />
          <Route
            path="add-mobile-post/:warehouse_id/:position"
            element={<AddMobilePagePost />}
          />
          <Route
            path="edit-mobile-post/:warehouse_id/:position/:media_id"
            element={<AddMobilePagePost />}
          />
          <Route
            path="add-promo-banner/:warehouse_id/:position"
            element={<AddPromoBanner />}
          />
          <Route
            path="edit-promo-banner/:warehouse_id/:position/:media_id"
            element={<AddPromoBanner />}
          />
          <Route
            path="add-mobile-marketing-image/:warehouse_id/:position"
            element={<AddMobileMarketingImage />}
          />
          <Route
            path="edit-mobile-marketing-image/:warehouse_id/:position/:media_id"
            element={<AddMobileMarketingImage />}
          />

          <Route
            path="add-web-link-marketing-image/:warehouse_id/:position"
            element={<AddWebLinkMarketingImage />}
          />
          <Route
            path="edit-web-link-marketing-image/:warehouse_id/:position/:media_id"
            element={<AddWebLinkMarketingImage />}
          />

          <Route
            path="add-mobile-brand-of-the-moment/:warehouse_id/:position"
            element={<AddMobileBrandsOfTheMoment />}
          />
          <Route
            path="edit-mobile-brand-of-the-moment/:warehouse_id/:position/:media_id"
            element={<AddMobileBrandsOfTheMoment />}
          />

          <Route
            path="add-web-marketing-image/:warehouse_id/:position"
            element={<AddWebMarketingImage />}
          />
          <Route
            path="edit-web-marketing-image/:warehouse_id/:position/:media_id"
            element={<AddWebMarketingImage />}
          />
          <Route
            path="add-discount/:warehouse_id/:position"
            element={<AddDiscount />}
          />
          <Route
            path="edit-discount/:warehouse_id/:position/:media_id"
            element={<AddDiscount />}
          />
        </Route>
        {/* end media */}

        {/* featured-sections */}
        <Route
          path="/dashboard/featured-sections"
          element={
            <ProtectedRoute path="">
              <FeaturedSection />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<FeaturedSectionPage />} />
        </Route>
        {/* end featured-sections */}

        {/* team */}
        <Route
          path="/dashboard/logs"
          element={
            <ProtectedRoute path="">
              <Logs />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<ListOfLogs />} />
        </Route>
        {/* end team */}

        <Route
          path="/"
          element={
            <ProtectedRoute path="/" notProtected>
              <SignInPage />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<SignIn />} />
        </Route>
      </Routes>
    </>
  );
};

export default Router;
