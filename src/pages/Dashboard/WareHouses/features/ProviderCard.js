import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";

import { ReactComponent as WarehouseIcon } from "assets/icons/warehouse-icon.svg";
import { ReactComponent as Caret_right_gray } from "assets/icons/caret-right-gray.svg";
import { ReactComponent as EditIcon } from "assets/icons/editPenLine.svg";
import Flag from "components/General/Flag";
import { getName } from "country-list";

export default function ProviderCard({ provider }) {
  const navigate = useNavigate();
  const countryName = getName(provider.country) || "N/A";
  return (
    <div
      onClick={() => navigate(`/dashboard/home/${provider?.id}`)}
      className="p-4 bg-white rounded-lg border border-grey-bordercolor hover:border-red transition-colors duration-500 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex cursor-pointer"
    >
      <div className="flex-col justify-start items-start gap-[18px] flex w-full">
        <div className="justify-start items-center w-full  inline-flex">
          <div className="justify-start items-center gap-2.5 flex w-full">
            <WarehouseIcon className="w-[40px] h-[40px]" />
            <div className="flex-col w-full justify-start items-start gap-0.5 inline-flex">
              <div className="text-black text-base font-medium">
                {provider.name}
              </div>
            </div>
          </div>
          <div
            className="ml-auto flex items-end justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="hover:text-red p-2"
              onClick={(e) => {
                navigate(`/warehouses/create_warehouse?${provider?.id}`, {
                  state: { ...provider },
                });
              }}
            >
              <EditIcon className="current-svg-fill" />
            </button>
          </div>
        </div>
        <div className="w-full h-[0px] border-1/2 border-grey-bordercolor border-opacity-60"></div>
        <div className="flex-col justify-start items-start gap-2 flex w-full">
          <div className="justify-between items-end flex w-full">
            <div className="flex-col justify-start items-start gap-2 inline-flex">
              <div className="text-zinc-400 text-xs font-normal leading-none">
                {provider.state}
              </div>
              <div className="justify-start items-center gap-1.5 inline-flex">
                <Flag countryCode={provider.country} />
                <div className="text-black text-base font-normal">
                  {countryName}
                </div>
              </div>
            </div>
            <Caret_right_gray
              onClick={() => navigate("/dashboard/earnings")}
              className="stroke-current cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

ProviderCard.propTypes = {
  provider: PropTypes.object,
};
