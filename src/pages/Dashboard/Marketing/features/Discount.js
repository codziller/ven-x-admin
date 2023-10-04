import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { ReactComponent as NewPlus } from "assets/icons/Plus/new_plus.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import MarketingStore from "../store";
import { observer } from "mobx-react-lite";
import { Button } from "components/General/Button";

const Discount = () => {
  const { warehouse_id } = useParams();

  const { loadingDiscounts, getDiscounts, discounts } = MarketingStore;
  useEffect(() => {
    getDiscounts({ data: { page: 1 } });
  }, []);

  const mobileDiscount = discounts;
  // const webDiscount = discounts?.filter((_) => _?.showOnWeb);

  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
        {loadingDiscounts ? (
          <CircleLoader blue />
        ) : (
          <>
            <div className="flex flex-col justify-start items-start gap-4 relative w-full">
              <div className="flex justify-between items-center w-full mb-3 gap-1">
                <span className="text-black text-lg sm:text-xl font-700 my-5">
                  Discounts
                </span>
                <Link
                  to={`/dashboard/marketing/add-discount/${warehouse_id}/mobile`}
                >
                  <Button
                    text="Add Discount"
                    icon={<Plus className="stroke-current" />}
                    className="hidden md:block"
                  />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 smlg:grid-cols-3 gap-4 justify-start items-start w-full mb-5">
                {mobileDiscount?.map((item, i) => {
                  return (
                    <Link
                      key={i + "card"}
                      to={
                        item
                          ? `/dashboard/marketing/edit-discount/${warehouse_id}/mobile/${item?.id}`
                          : `/dashboard/marketing/add-discount/${warehouse_id}/mobile`
                      }
                      className="flex flex-col justify-center items-center cursor-pointer min-w-[300px]  max-w-[300px] bg-[#F8F8F8] rounded-[7px] border-[0.8px] border-grey-border hover:border-blue transition-colors duration-500 ease-in-out gap-2.5"
                    >
                      {item ? (
                        <img
                          src={item?.imageUrl}
                          alt="slide"
                          className="object-cover w-full h-full  min-h-[138px]  max-h-[138px] rounded-t-[7px]"
                        />
                      ) : (
                        <NewPlus className="stroke-current" />
                      )}

                      <span className="text-grey-text text-sm">
                        {item?.titleText}
                      </span>
                      <span className="text-grey-text">
                        {item?.discountCode}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default observer(Discount);
