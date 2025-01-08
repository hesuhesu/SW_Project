const Overlay = ({ setIsActive, navigate }) => {

  return (
    <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h2>WYSIWYG Owner?</h2>
            <p>계정이 있으신가요? 그럼 로그인 해주세요~</p>
            <button type="button" onClick={() => setIsActive(false)}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h2>Welcome!</h2>
            <p>아직 계정이 없으신가요? 그럼 회원가입 해주세요!</p>
            <button type="button" onClick={() => setIsActive(true)}>
              Sign Up
            </button>
            <p></p>
            <h2>Home?</h2>
            <p>홈 화면으로 가시겠어요? Home 을 눌러주세요..</p>
            <button type="button" onClick={() => navigate("/")}>
              Home
            </button>
          </div>
    </div>
  );
}

export default Overlay;