import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Outlet } from "react-router-dom";

function Header() {
    return (
        <div>
            <h1>Dong-A 3D Model WYSIWYG Editor &nbsp;
                <Badge bg="secondary" as={Button}>
                 Made By React
                </Badge>
            </h1>
            <Outlet/>
        </div>
    )
}
export default Header;