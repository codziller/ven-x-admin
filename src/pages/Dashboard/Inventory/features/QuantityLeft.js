import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { observer } from "mobx-react-lite";
import { isEmpty } from "lodash";
import ProductsStore from "pages/Dashboard/Products/store";
import moment from "moment";
import Amount from "components/General/Numbers/Amount";
import { pageCount } from "utils/appConstant";
import Table from "components/General/Table";
import { numberWithCommas } from "utils/formatter";

const QuantityLeft = ({ details, toggler }) => {
  const { product, getProductCostPriceHistory, getProductLoading } =
    ProductsStore;

  const { productCostPrice } = details;
  const columns = [
    {
      name: "Cost Price",
      selector: (row) => (
        <div className="flex justify-start items-center gap-4">
          <Amount value={row?.costPrice} />
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => {
        const amountA = parseFloat(a.costPrice);
        const amountB = parseFloat(b.costPrice);
        return amountA - amountB;
      },
    },
    {
      name: "Quantity Left",
      selector: (row) => (
        <div className="flex justify-start items-center gap-4">
          {numberWithCommas(row?.quantityLeft)}
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => {
        const amountA = parseFloat(a.quantityLeft);
        const amountB = parseFloat(b.quantityLeft);
        return amountA - amountB;
      },
    },

    {
      name: "Last Updated",
      selector: (row) => moment(row.updatedAt).format("MMM Do, YYYY hh:mma"),
      sortable: true,
      sortFunction: (a, b) => {
        // Parse 'date' values as Moment.js objects and compare
        const dateA = moment(a.updatedAt);
        const dateB = moment(b.updatedAt);

        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      },
    },
  ];
  const displayedItems = productCostPrice || [];
  const displayedItemsCount = displayedItems?.length || 0;
  return (
    <>
      <div className="flex flex-col justify-center items-start gap-y-2 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="mb-5">
            <Link to={details?.link} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mr-auto">
            <Close />
          </button>
        )}

        <p className="font-600 text-[16px] ">{product?.name} Cost Prices</p>

        <div className="w-full flex flex-col justify-center items-center gap-4 mt-4">
          <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
            {!isEmpty(displayedItems) ? (
              <Table
                data={displayedItems}
                columns={columns}
                pageCount={displayedItemsCount / pageCount}
                tableClassName="txn-section-table"
                noPadding
              />
            ) : (
              <>
                <div className="text-sm text-grey flex flex-col justify-center items-center space-y-3 h-full">
                  Cost prices for this product is currency empty
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mt-5">
            <Button
              onClick={() => toggler?.()}
              text="Close"
              fullWidth
              whiteBg
            />
          </div>
        </div>
      </div>
    </>
  );
};
QuantityLeft.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
export default observer(QuantityLeft);
