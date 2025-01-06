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
export const buttonStyles = css`
  background: linear-gradient(135deg, #555, #777);
  border: none;
  color: white;
  padding: 10px 20px;
  margin-right: 5px;
  font-size: 10px;
  cursor: pointer;
  transition: transform 0.4s, box-shadow 0.4s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  border-radius: 5px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  }
`;

export const H3 = css`
    font-size: 15px;
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