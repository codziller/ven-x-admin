import React from "react";
import PropTypes from "prop-types";

const Dropdown = ({ categories }) => {
  return (
    <div className="pt-4 absolute animate-slide -left-[10px] top-[20px] w-fit h-fit">
      <div
        className={`grid grid-flow-col gap-20  justify-between items-start w-fit text-base transition-all duration-150 ease-in-out bg-white px-14 py-5  z-30 font-medium`}
      >
        {categories?.map(({ name, subCategories, brands }) => (
          <div
            key={name}
            className={`flex flex-col justify-start align-start gap-y-3 h-fit`}
          >
            <h3 className="font-bold mb-1 whitespace-nowrap">{name}</h3>
            {subCategories?.map(({ name }, i) => (
              <div
                key={name}
                className={`flex justify-start items-center hover:text-grey-text text-blue bani-base whitespace-nowrap gap-2 `}
              >
                <span className="text-current whitespace-nowrap">{name}</span>
              </div>
            ))}
            {brands?.map?.(({ name, id, brandName }, i) =>
              id ? (
                <div
                  key={id}
                  className={`flex justify-start items-center hover:text-grey-text text-blue bani-base whitespace-nowrap gap-2 `}
                >
                  <span className="text-current whitespace-nowrap">
                    {name || brandName}
                  </span>
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  categories: PropTypes.array,
};

export default Dropdown;
