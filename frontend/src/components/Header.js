import styled from "styled-components";
import { BasicHeaderStructure } from "../utils/CSS";

const Header = () => {
    return (
        <HeaderOne>Dong-A 3D Model WYSIWYG Editor</HeaderOne>
    );
}

export default Header;

const HeaderOne = styled.h1`
    ${BasicHeaderStructure('4rem')}
`;