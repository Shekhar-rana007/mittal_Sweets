import React, { useEffect, useRef } from "react";
import noUiSlider from "nouislider";
// import "nouislider/distribute/nouislider.css";

const RangeSlider = ({ startMin, startMax, min, max, step, handleChange }) => {
  const sliderRef = useRef(null);
  const minInputRef = useRef(null);
  const maxInputRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current) {
      const slider = noUiSlider.create(sliderRef.current, {
        start: [startMin, startMax],
        connect: true,
        step: step,
        tooltips: true,
        range: {
          min: min,
          max: max,
        },
        format: {
          from: function (value) {
            return Number(value);
          },
          to: function (value) {
            return parseInt(value, 10) + "₹";
          },
        },
      });

      slider.on("update", (values, handle) => {
        let value = values[handle];
        value = value.replace(/\D/g, "");
        if (handle) {
          maxInputRef.current.value = Math.round(value);
        } else {
          minInputRef.current.value = Math.round(value);
        }
      });

      minInputRef.current.addEventListener("change", () => {
        slider.set([minInputRef.current.value, null]);
        handleChange({
          target: { name: "min", value: minInputRef.current.value },
        });
      });

      maxInputRef.current.addEventListener("change", () => {
        slider.set([null, maxInputRef.current.value]);
        handleChange({
          target: { name: "max", value: maxInputRef.current.value },
        });
      });
    }
  }, []);

  return (
    <div className="widget-range-slider">
      <div ref={sliderRef} className="range-slider" />
      <div className="input-group input-group-sm">
        <input
          ref={minInputRef}
          className="form-control range-slider-input-min"
          type="number"
          defaultValue={startMin}
          name="min"
          onChange={handleChange}
          min="0"
          max={max}
          step="10"
        />
        <span className="input-group-text text-body-secondary user-select-none">
          ₹
        </span>
        <input
          ref={maxInputRef}
          className="form-control range-slider-input-max"
          type="number"
          defaultValue={startMax}
          name="max"
          onChange={handleChange}
          min={min}
          max="1000"
          step="10"
        />
        <span className="input-group-text text-body-secondary user-select-none">
          ₹
        </span>
      </div>
    </div>
  );
};

export default RangeSlider;
