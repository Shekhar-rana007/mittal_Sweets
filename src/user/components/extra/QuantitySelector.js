import React, { useState } from 'react';

const QuantitySelector = ({ setTotalQuantity }) => {
  // State to manage the quantity value
  const [quantity, setQuantity] = useState(1);

  // Function to handle decrement of the quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setTotalQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  // Function to handle increment of the quantity
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
    setTotalQuantity(prevQuantity => prevQuantity + 1);
  };

  return (
    <div className="quantity-products d-flex justify-content-center">
      {/* Button to decrement quantity */}
      <button className="quantity-btn-minus" onClick={decrementQuantity}>
        <i className="ri-subtract-line"></i>
      </button>
      
      {/* Input field to display and edit the quantity */}
      <input
        id="quantityNumber1"
        className="quantity-number"
        type="number"
        value={quantity}
        readOnly // To make the input field read-only
      />
      
      {/* Button to increment quantity */}
      <button className="quantity-btn-plus" onClick={incrementQuantity}>
        <i className="ri-add-line"></i>
      </button>
    </div>
  );
};

export default QuantitySelector;
