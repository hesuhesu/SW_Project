import styled from "styled-components";
import { paddingMargin, outlineSetup } from "../../utils/CSS";

const Tip = () => {
    return (
        <TipContainer>
            🚀 3D 모델을 생성, 업로드, 다운로드 가능한 Basic 한 에디터 입니다. <br /><br />
            1. 카메라 조절과 빛의 조절이 가능하며, 카메라 조절 시 수동으로 숫자 입력(0 이상)도 되지만, OrbitControls 기능으로 마우스 조절도 가능합니다.<br /><br />
            2. AxesHelper, GridHelper 가 거슬린다면 끄고 켜는게 가능합니다. 직관적인 모델의 구상을 보려면 기능을 활용해보세요.<br /><br />
            3. 생성한 모델은 속성값과 재질의 변경, 색상 변경 등의 기능이 존재하며 고유한 Shape 속성 변경은 <span style={{ color: "red" }}>불가</span>합니다.<br /><br />
            4. 모델을 생성하려 하지만 생성되지 않는 경우 Segement 가 생성 최소 수준을 벗어나거나, 길이가 0 인 경우 등 다양한 요인이 존재합니다.<br /><br />
            5. 생성된 모델은 마우스로 쉽게 조작이 가능합니다. 크기 확대축소, 모델 위치 변경, 모델의 회전, 삭제 등 기능이 존재하며 a,s,d,del 키를 누르게되면 모드가 변경됩니다.<br /><br />
            6. 모델을 선택한 이후 ctrl + c, ctrl + v 가능합니다. 단 1회성 복사 붙여넣기 이므로 원하는 객체를 다음 기회에 선택 해야합니다.<br /><br />
            7. 도형을 업로드 가능합니다. 해당 모델을 잘 컨트롤하여 본 페이지에서 적용되는 생성 모델과 조화를 이뤄보세요!
        </TipContainer>
    )
}

export default Tip;

const TipContainer = styled.div`
    ${paddingMargin('10px', '0 0', '10px', '0')}
    ${outlineSetup()}
    font-weight: bold;
    font-size: 14px;
    overflow-y: auto;
    max-height: 300px;
    background-color: rgba(255, 255, 255, 0.7);
`;