import { css } from 'styled-components';

// 패딩과 마진 믹스인
export const paddingMargin = (padding = '0px', margin = '0px') => css`
  padding: ${padding};
  margin: ${margin};
`;

// 아웃라인 설정 믹스인
export const outlineSetup = (
  boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)',
  textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)',
  borderRadius = '5px'
) => css`
  box-shadow: ${boxShadow};
  text-shadow: ${textShadow};
  border-radius: ${borderRadius};
`;

/* 사용법 : 
  ${paddingMargin('10px', '0 0', '20px', '0')}
  ${outlineSetup()} 
*/

// 버튼 스타일 믹스인
export const ThreeDEditorButtonStyles = css`
  background: linear-gradient(135deg, #555, #777);
  border: none;
  color: white;
  padding: 10px 20px;
  margin-right: 5px;
  font-size: 10px;
  cursor: pointer;
  transition: transform 0.4s, box-shadow 0.4s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  border-radius: 0.5rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  }
`;

export const ThreeDEditorHeader3 = css`
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
    letter-spacing: 1px; /* 자간 조정 */
    border-bottom: 3px solid rgba(255, 255, 255, 0.3); /* 하단 테두리 */
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(50, 50, 50, 0.5)); /* 배경 그라데이션 */
    border-radius: 5px;
`;

// 사용법 : ${buttonStyles}, ${H3}

export const BasicHeaderStructure = (
  fontSize = '4rem',
) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: ${fontSize};
  font-weight: 900;
  color: #fff;
  text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9,
              0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa,
              0 6px 1px rgba(0, 0, 0, .1), 0 0 5px rgba(0, 0, 0, .1),
              0 1px 3px rgba(0, 0, 0, .3), 0 3px 5px rgba(0, 0, 0, .2),
              0 5px 10px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .2),
              0 20px 20px rgba(0, 0, 0, .15);
`