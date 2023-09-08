import { forwardRef } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DatePicker from "react-datepicker";
import clsx from "classnames";

import { months, years } from "utils/date";
import { ReactComponent as CalendarIcon } from "assets/icons/calendar.svg";
import { ReactComponent as PrevYearIcon } from "assets/icons/Arrow/double-arrow-left.svg";
import { ReactComponent as NextYearIcon } from "assets/icons/Arrow/double-arrow-right.svg";
import { ReactComponent as ArrowRight } from "assets/icons/Arrow/arrow-right-thick.svg";
import { ReactComponent as ArrowLeft } from "assets/icons/Arrow/arrow-left-thick.svg";

import "react-datepicker/dist/react-datepicker.css";
import { DatePickerWrapper } from "./style";

const CustomInput = forwardRef(
  ({ value, onChange, placeholder, autoComplete, ...rest }, ref) => (
    <input
      placeholder={placeholder}
      onChange={onChange}
      ref={ref}
      value={value}
      className="custom-input"
      {...rest}
      autoComplete={autoComplete}
    />
  )
);

CustomInput.displayName = "CustomPickerInput";

export default function DatePickerComponent({
  label,
  onChange,
  value,
  placeholder,
  name,
  containerStyle,
  labelClass,
  ...rest
}) {
  return (
    <DatePickerWrapper containerStyle={containerStyle}>
      <label className={clsx(labelClass)}>{label}</label>
      <div className="datepicker-full-container">
        <DatePicker
          placeholderText={placeholder}
          selected={value}
          autoComplete="off"
          onChange={(value) => onChange(value, { name, value })}
          customInput={<CustomInput />}
          showMonthDropdown
          showYearDropdown
          dropdownMode="scroll"
          {...rest}
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            decreaseYear,
            increaseMonth,
            increaseYear,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
            nextYearButtonDisabled,
            prevYearButtonDisabled,
          }) => (
            <div className="calendar-header">
              <div
                className="year-controls prev"
                onClick={decreaseYear}
                disabled={prevYearButtonDisabled}
              >
                <PrevYearIcon />
              </div>
              <div className="central-control">
                <div
                  className="month-controls prev"
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                >
                  <ArrowLeft className="month-arrow" />
                </div>

                <div className="current-date">
                  <select
                    value={moment(date).format("MMMM")}
                    className="date-month"
                    onChange={({ target: { value } }) => {
                      changeMonth(months.indexOf(value));
                    }}
                  >
                    {months.map((option) => (
                      <option key={option} value={option}>
                        {option.substring(0, 3)}
                      </option>
                    ))}
                  </select>

                  <select
                    className="date-year"
                    value={moment(date).format("YYYY")}
                    onChange={({ target: { value } }) => changeYear(value)}
                  >
                    {years().map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className="month-controls next"
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                >
                  <ArrowRight className="month-arrow" />
                </div>
              </div>

              <div
                className="year-controls next"
                onClick={increaseYear}
                disabled={nextYearButtonDisabled}
              >
                <NextYearIcon />
              </div>
            </div>
          )}
        />
        <CalendarIcon className="calendar-icon" />
      </div>
    </DatePickerWrapper>
  );
}

CustomInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
};

DatePickerComponent.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  containerStyle: PropTypes.object,
  labelClass: PropTypes.string,
  rest: PropTypes.object,
};
