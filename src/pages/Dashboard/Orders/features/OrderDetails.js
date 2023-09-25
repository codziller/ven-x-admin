import React, { useEffect } from "react";
import PropTypes from "prop-types";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import OrdersStore from "../store";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { transactionAmount } from "utils/transactions";
import classNames from "classnames";
export const DetailBlock = ({ title, value, values, valueClassName }) => (
  <div className={`flex flex-col justify-center items-start w-full gap-2 px-4`}>
    <h6 className="text-base">{title}</h6>
    {value && (
      <p className={classNames("text-grey-label text-sm", valueClassName)}>
        {value}
      </p>
    )}
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

  useEffect(() => {
    getOrder({ data: { id: details?.id } });
  }, [order?.id]);

  return (
    <div className="gap-y-4 py-4 w-full h-full pb-4">
      <h3 className="text-lg mb-5">Order Details</h3>

      {getOrderLoading ? (
        <div className="w-full flex justify-center items-center min-h-36">
          <CircleLoader blue />
        </div>
      ) : (
        <div className="flex flex-col justify-start items-start w-full border border-grey-bordercolor rounded">
          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock
              title="Customer"
              value={`${order?.calculatedOrder?.user?.firstName} 
          ${order?.calculatedOrder?.user?.lastName}`}
            />

            <DetailBlock
              title="Gender"
              value={`${order?.calculatedOrder?.user?.gender}`}
            />
          </div>

          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock
              title="Email"
              value={`${order?.calculatedOrder?.user?.email}`}
            />

            <DetailBlock
              title="Phone"
              value={`${order?.calculatedOrder?.user?.phoneNumber}`}
            />
          </div>
          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock title="Order Code" value={order?.orderCode} />
            <DetailBlock
              title="Order Date"
              value={moment(order?.updatedAt).format("MMM Do, YYYY hh:mma")}
            />
          </div>

          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock
              title="Order Status"
              value={order?.orderStatus}
              valueClassName={classNames({
                "text-yellow":
                  order?.orderStatus === "IN_PROGRESS" ||
                  order?.orderStatus === "PENDING" ||
                  order?.orderStatus === "DISPATCHED",
                "text-green": order?.orderStatus === "COMPLETED",
                "text-red-deep": order?.orderStatus === "CANCELLED",
              })}
            />

            <DetailBlock
              title="Payment Status"
              value={order?.paid ? "Paid" : "Unpaid"}
              valueClassName={classNames({
                "text-green": order?.paid,
                "text-red": !order?.paid,
              })}
            />
          </div>

          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock
              title="Order Items"
              values={order?.calculatedOrder?.calculatedOrderProducts}
            />
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
