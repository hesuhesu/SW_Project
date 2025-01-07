import styled from "styled-components";

const BoardDetail = ({ data }) => {
    return (
        <PostInformationContainer className="post-view-inf">
            <div className="post-view-row">
                <label>제목</label>
                <label>{data.title}</label>
            </div>
            <div className="post-view-row">
                <label>글쓴이</label>
                <label>{data.writer}</label>
            </div>
            <div className="post-view-row">
                <label>작성일</label>
                <label>{data.createdAt}</label>
            </div>
        </PostInformationContainer>
    )
}

export default BoardDetail;

const PostInformationContainer = styled.div`
    font-size: 1rem;
    font-weight: bold;
    color: #555;
    margin-bottom: 1.5rem;

    .post-view-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e5e5;

        & > label:first-child {
            margin: 0.5rem 0;
            width: 30%;
            font-weight: bold;
        }

        & > *:nth-child(2) {
            margin: 0.5rem 0;
            width: 70%;
        }
  }
`;