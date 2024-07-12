import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from 'react-bootstrap/Button';

function Toast() {
    const notify = () => {
        toast("Toast Message");
    };
    
    return (
        <div>
        <Button onClick={notify}>Notify !</Button>
        <ToastContainer
            limit={1}
            autoClose={2000}
            /*
            position="top-right"
            limit={1}
            closeButton={false}
            autoClose={2000}
            hideProgressBar
            */
        />
        </div>
    );
}

export default Toast;