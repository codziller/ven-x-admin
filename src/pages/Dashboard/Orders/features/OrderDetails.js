import React, { useEffect } from "react";
import PropTypes from "prop-types";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import OrdersStore from "../store";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { transactionAmount } from "utils/transactions";
const DetailBlock = ({ title, value, values }) => (
  <div className={`flex flex-col justify-center items-start w-full gap-2 px-4`}>
    <h6 className="text-base">{title}</h6>
    {value && <p className="text-grey-label text-sm">{value}</p>}
    {values?.map((item, i) => (
      <div className="flex justify-start items-center gap-2 w-full">
        <img
          src={item?.product?.imageUrls?.[0]}
          className="w-[45px] h-[45px] min-w-[45px] min-h-[45px]"
          alt={item?.product?.name}
        />
        <p key={i} className="text-grey-label text-sm truncate max-w-[60%]">
          {item?.product?.name}{" "}
          <span className="text-red">x{item?.quantity}</span>
        </p>
      </div>
    ))}
  </div>
);
const OrderDetails = ({ details }) => {
  const { getOrder, getOrderLoading, order } = OrdersStore;

  console.log("details: ", details);

  useEffect(() => {
    getOrder({ data: { id: details?.id } });
  }, [order?.id]);

  console.log("order6636: ", order);
  return (
    <div className="gap-y-4 py-4 w-full h-full pb-4">
      <h3 className="text-lg mb-5">Order Details</h3>

      {getOrderLoading ? (
        <CircleLoader blue />
      ) : (
        <div className="flex flex-col justify-start items-start w-full border border-grey-bordercolor rounded">
          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock
              title="Customer"
              value={`${order?.calculatedOrder?.user?.firstName} 
          ${order?.calculatedOrder?.user?.lastName}`}
            />
          </div>
          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock title="Order Code" value={order?.orderCode} />
          </div>
          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock
              title="Products"
              values={order?.calculatedOrder?.calculatedOrderProducts}
            />
          </div>
          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock
              title="Order Date"
              value={moment(order?.updatedAt).format("MMM Do, YYYY hh:mma")}
            />
            {/* <DetailBlock title="Delivery Date" value={"June 20, 2023"} /> */}
          </div>
          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock title="Payment Method" value={order?.paymentMethod} />
          </div>

          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock
              title="Delivery Address"
              value={order?.calculatedOrder?.address?.addressText}
            />
          </div>

          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock
              title="Delivery Fee"
              value={order?.calculatedOrder?.deliveryFee}
            />

            <DetailBlock
              title="Service Charge"
              value={order?.calculatedOrder?.serviceCharge}
            />
          </div>
          <div className="flex justify-between items-center w-full py-[18px]">
            <DetailBlock title="Order Total" value={transactionAmount(order)} />
          </div>
        </div>
      )}
    </div>
  );
};

DetailBlock.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
};
OrderDetails.propTypes = {
  details: PropTypes.object,
};
export default observer(OrderDetails);
