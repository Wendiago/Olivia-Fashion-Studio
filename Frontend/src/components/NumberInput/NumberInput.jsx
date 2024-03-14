import React, { useState } from "react";
import PropTypes from "prop-types";
import { Minus, Plus } from "../../assets/icons";
import { toast } from "react-toastify";

const NumberInput = ({
  initialValue,
  minValue,
  maxValue,
  onChange,
  identifier, //Set identifier for the Number input
}) => {
  const [value, setValue] = useState(initialValue || 1);

  const handleIncrement = () => {
    if (maxValue === undefined || value < maxValue) {
      setValue(value + 1);
      onChange(value + 1, identifier);
    }
  };

  const handleDecrement = () => {
    if (minValue === undefined || value > minValue) {
      if (value > 1) {
        setValue(value - 1);
        onChange(value - 1, identifier);
      }
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value.trim();
    const newValue = inputValue === "" ? "" : parseInt(inputValue) || 1;
    setValue(newValue);
    onChange(newValue, identifier);
  };

  const handleBlur = (e) => {
    if (e.target.value.trim() === "") {
      setValue(1);
      onChange(1, identifier);
    } else if (maxValue) {
      if (parseInt(e.target.value.trim()) > maxValue) {
        setValue(1);
        onChange(1, identifier);
        toast.error(`Sorry. You can only buy ${maxValue} pieces}`);
      }
    }
  };

  return (
    <div className="grid grid-cols-[1fr_50px_1fr] w-[120px]">
      <div
        className="minus-button border border-grey-300 py-[3px] font-body font-[600] flex items-center justify-center cursor-pointer"
        onClick={handleDecrement}
      >
        <Minus className="fill-dark" />
      </div>
      <input
        className="input border border-grey-300 py-[3px] px-[3px] font-body text-center"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        id={identifier}
      />
      <div
        className="add-button border border-grey-300 py-[3px] font-body font-[600] flex items-center justify-center cursor-pointer"
        onClick={handleIncrement}
      >
        <Plus className="fill-dark" />
      </div>
    </div>
  );
};

NumberInput.propTypes = {
  initialValue: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  onChange: PropTypes.func,
};

NumberInput.defaultProps = {
  identifier: undefined,
};
export default NumberInput;
