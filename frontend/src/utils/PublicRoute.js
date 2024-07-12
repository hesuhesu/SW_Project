import { Navigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";

const PublicRoute = () => {
    const user = localStorage.key(0);
    if (user){
        Swal.fire({
            title: "알림",
            icon:'error',
            html: `잘못된 접근입니다..`,
            showCancelButton: false,
            confirmButtonText: "확인",
          }).then(() => {});
    }
    return user ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;