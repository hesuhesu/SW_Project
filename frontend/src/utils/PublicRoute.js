import { Navigate, Outlet } from "react-router-dom";
import { errorMessage } from "./SweetAlertEvent";

const PrivateRoute = () => {
    const user = localStorage.key(0);
    if (user){
        errorMessage("잘못된 접근입니다..");
    }
    return user ? <Navigate to="/" /> : <Outlet />;
};

export default PrivateRoute;