
import { Outlet } from "react-router-dom";
import '../css/Header.css'

function Header() {
    return (
        <div className="Header">
            <h1 className="Header-h1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                Dong-A 3D Model WYSIWYG Editor
                
            </h1>
            <Outlet />
        </div>
    );
}

export default Header;