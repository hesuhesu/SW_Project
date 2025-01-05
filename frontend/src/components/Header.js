import { Outlet } from "react-router-dom";
import '../css/Header.scss'

function Header() {
    return (
        <div className="Header">
            <h1>Dong-A 3D Model WYSIWYG Editor</h1>
            <Outlet />
        </div>
    );
}

export default Header;