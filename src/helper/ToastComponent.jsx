import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';


// ToastError Component
const ToastError = ({ t, message }) => (
    <span className="text-danger font-15 my-alert">
        <img src="/assets/img/close.gif" className='rounded-circle me-1' width={25} style={{ transform: "scale(1.1)" }} />
        <span className='mt-1'>  {message} </span>
        <button
            onClick={() => toast.dismiss(t.id)}
            className="border-0 bg-danger py-1 px-2 text-white rounded-md fs-15 ms-2"
        >
            Close
        </button>
    </span>
);

ToastError.propTypes = {
    t: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    message: PropTypes.string.isRequired,
};

// ToastSuccess Component
const ToastSuccess = ({ t, message }) => (
    <span className="text-success font-15 my-alert">
        <img src="/assets/img/check.gif" className='rounded-circle me-1' width={25} style={{ transform: "scale(1.1)" }} />
        <span className='mt-1'>  {message} </span>
        <button
            onClick={() => toast.dismiss(t.id)}
            className="border-0 bg-success py-1 px-2 text-white rounded-md fs-15 ms-2"
        >
            Close
        </button>
    </span>
);


ToastSuccess.propTypes = {
    t: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    message: PropTypes.string.isRequired,
};



export { ToastError, ToastSuccess };
