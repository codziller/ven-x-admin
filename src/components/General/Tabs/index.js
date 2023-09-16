import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "classnames";

const Tabs = ({ tabs = [], activeTab, setActiveTab }) => {
  const tabRef = useRef(null);
  const elementsRef = useRef([]);

  const getTabRect = () => {
    const containerLeft = tabRef?.current?.getBoundingClientRect?.()?.left;
    const currentIndex = tabs.indexOf(
      tabs.find((tab) => (tab?.name || tab) === activeTab)
    );
    const elementLeft =
      elementsRef?.current?.[currentIndex]?.getBoundingClientRect?.()?.left;
    const width = elementsRef?.current?.[currentIndex]?.offsetWidth;
    const left = elementLeft - containerLeft;

    return { width, left };
  };

  useEffect(() => {
    elementsRef.current = elementsRef.current.slice(0, tabs.length);
  }, [tabs]);
  return (
    <div className="w-full flex relative mb-6">
      <div className="w-full ">
        <div
          className="flex flex-row justify-start items-start w-full gap-2"
          ref={tabRef}
        >
          {tabs.map((tab, index) => {
            const tabName = tab?.name || tab;
            return (
              <span
                key={index}
                ref={(el) => (elementsRef.current[index] = el)}
                className={clsx(
                  `w-fit px-2 pb-3 text-center cursor-pointer whitespace-nowrap text-sm`,
                  {
                    "text-blue ": activeTab === tabName,
                    "text-grey-text": activeTab !== tabName,
                  }
                )}
                onClick={() => setActiveTab(tab?.name || tab)}
              >
                {tab?.label || tab}
              </span>
            );
          })}
        </div>

        <div className="relative w-full h-[1px] bg-grey-bordercolor">
          <div
            className={`absolute -top-[3px] h-1 bg-blue transition-all duration-300 ease-in-out`}
            style={{
              //   left: getTabRect()?.left || 0,
              transform: `translateX(${getTabRect()?.left || 0}px)`,
              width: `${getTabRect()?.width || 0}px`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
Tabs.propTypes = {
  tabs: PropTypes.array,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
};

export default Tabs;
