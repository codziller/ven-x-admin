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
import ProductsPage from "pages/Dashboard/Products/features";
import Products from "pages/Dashboard/Products";
import AddProduct from "pages/Dashboard/Products/features/AddProduct";
import StaffPage from "pages/Dashboard/Staff/features";
import Staff from "pages/Dashboard/Staff";
import PromoPage from "pages/Dashboard/Promo/features";
import Promo from "pages/Dashboard/Promo";
import AddPromo from "pages/Dashboard/Promo/features/AddPromo";
import AddHomeSlider from "pages/Dashboard/HomeSlider/features/AddHomeSlider";
import HomeSlider from "pages/Dashboard/HomeSlider";
import HomeSliderPage from "pages/Dashboard/HomeSlider/features";
import NewOffer from "pages/Dashboard/NewOffer";
import AddNewOffer from "pages/Dashboard/NewOffer/features/AddNewOffer";
import NewOfferPage from "pages/Dashboard/NewOffer/features";
import FeaturedSectionPage from "pages/Dashboard/FeaturedSection/features";
import FeaturedSection from "pages/Dashboard/FeaturedSection";
import Orders from "pages/Dashboard/Orders";
import OrdersPage from "pages/Dashboard/Orders/features";
import Inventory from "pages/Dashboard/Inventory";
import InventoryPage from "pages/Dashboard/Inventory/features";
import Categories from "pages/Dashboard/Categories";
import CategoriesPage from "pages/Dashboard/Categories/features";
import BackInStock from "pages/Dashboard/BackInStock";
import BackInStockPage from "pages/Dashboard/BackInStock/features";
import Brands from "pages/Dashboard/Brands";
import BrandsPage from "pages/Dashboard/Brands/features";
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
          path="/dashboard/products"
          element={
            <ProtectedRoute path="">
              <Products />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<ProductsPage />} />
          <Route path="add-product/:warehouse_id" element={<AddProduct />} />
          <Route
            path="edit-product/:warehouse_id/:product_id"
            element={<AddProduct />}
          />
        </Route>
        {/* end products */}

        {/* orders */}
        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute path="">
              <Orders />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<OrdersPage />} />
        </Route>
        {/* end orders */}

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
        </Route>
        {/* end brands */}

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
          path="/dashboard/staff"
          element={
            <ProtectedRoute path="">
              <Staff />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<StaffPage />} />
        </Route>
        {/* end staff */}

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
        {/* home-slider-images */}
        <Route
          path="/dashboard/slider-images"
          element={
            <ProtectedRoute path="">
              <HomeSlider />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<HomeSliderPage />} />
          <Route
            path="add-slider-images/:warehouse_id"
            element={<AddHomeSlider />}
          />
        </Route>
        {/* end home-slider-images */}

        {/* new-offer-images */}
        <Route
          path="/dashboard/new-offer-images"
          element={
            <ProtectedRoute path="">
              <NewOffer />
            </ProtectedRoute>
          }
        >
          <Route path=":warehouse_id" element={<NewOfferPage />} />
          <Route
            path="add-new-offer-images/:warehouse_id"
            element={<AddNewOffer />}
          />
        </Route>
        {/* end new-offer-images */}

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
