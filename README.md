# Project : Dong-A WYSIWYG Editor 

<br>

___

<br>

### ✅ Team Rule

<br>

- basic markdown 문법 숙지
  - issue & PR 작성 요령
- checklist 에 맞게 develop at day or week
  - [ ] 는 체크리스트 미 체크
  - [x] 는 체크리스트 체크
- PR 시 해당 Repository 에서 branch 생성하거나 fork 어느 과정이든 상관 x
- 작성 시 code review 2명(같은 팀 + 다른 팀 한 명 포함) 걸고 검증 받기 -> 방학 중 빠른 개발을 위해 팀장 승인받고 바로 PR
- 서로 fork 하거나 생성한 branch 를 로컬 저장소에 저장하고 PR 전에 변경 사항 확인할 것
- 버전 별 branch 를 생성하여 추가 오류에 대비할 수 있도록 할 것 -> Basic Git Flow 방식 중 하나
- **(사용자용 필수 메뉴얼)fork, clone 하여 사용하려면 manual 폴더의 "React & NodeJS Manual.md" 를 참조해주세요!**

<br>

___

<br>

### 👨‍💻 Team Introduce

<br>

|<a href = "https://github.com/hesuhesu" target = 'blank'><img src = "https://avatars.githubusercontent.com/u/91324571?v=4" heigth = "100" width = "100"><a>|<a href = "https://github.com/jihoonjeong56" target = 'blank'><img src = "https://avatars.githubusercontent.com/u/100738560?v=4" heigth = "100" width = "100"><a>|<a href = "https://github.com/shinseungho0" target = 'blank'><img src = "https://avatars.githubusercontent.com/u/100738567?v=4" heigth = "100" width = "100"><a>|<a href = "https://github.com/dongs3" target = 'blank'><img src = "https://avatars.githubusercontent.com/u/144899149?v=4" heigth = "100" width = "100"><a>|
|:---:|:---:|:---:|:---:|
|**hesuhesu**|**jihoonjeong56**|**shinseungho0**|**dongs3**|
|backend|backend|frontend|frontend|

<br>

___

<br>

### 🌱 Using Manual

<br>

**! MongoDB Compass 설치 시 GUI 로 데이터를 쉽게 파악 가능합니다!**

**순서대로 따라하시면 무리없이 사용 가능합니다**

<br>

- backend 폴더 root 위치에 .env 파일을 생성 후 다음과 같이 기입합니다.

```
MONGO_URI=mongodb://127.0.0.1:27017/
HOST=http://localhost
PORT=5000
```

- frontend 폴더 root 위치d에 .env 파일을 생성 후 다음과 같이 기입합니다.

```
REACT_APP_HOST=http://localhost
REACT_APP_PORT=5000
GENERATE_SOURCEMAP=false
```

- 위의 환경변수 세팅이 완료되었다면, backend 폴더와 frontend 폴더 root 위치에서 각각 터미널로 다음과 같은 명령어를 기입합니다.

```
npm install
```

- 위의 작업이 완료되었다면, backend 폴더 root 위치에서 다음과 같은 명령어를 입력하면 server.js 가 실행됩니다.

```
node server.js
```

- frontend 폴더 root 위치에서 다음과 같은 명령어를 입력하면 클라이언트 빌드 및 실행이 완료됩니다.

```
npm run build
```

```
npm start
```

#### 프로젝트 종료 / 재실행

- 프로젝트 종료 시 frontend, backend 터미널에 ctrl + c 를 기입하면 됩니다.
- 프로젝트의 재 실행은 다음과 같습니다
- backend 서버 실행(backend 폴더 root)

```
node server.js
```

- frontend 클라이언트 실행(frontend 폴더 root)

```
npm start
```

<br>

___

<br>

### 🚀 기술 스택 + 사용 툴

<br>

<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"><img src="https://img.shields.io/badge/Git-F05032.svg?&style=for-the-badge&logo=Git&logoColor=white"><img src="https://img.shields.io/badge/Html5-E34F26?style=for-the-badge&logo=Html5&logoColor=white"><img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=for-the-badge&logo=Amazon EC2&logoColor=white"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"><img src="https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=Node.js&logoColor=white"><img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"><img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=NGINX&logoColor=white"><img src="https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=Webpack&logoColor=white"><img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"><img src="https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=MUI&logoColor=white"><img src="https://img.shields.io/badge/Css3-1572B6?style=for-the-badge&logo=Css3&logoColor=white"><img src="https://img.shields.io/badge/VisualStudioCode-007ACC?style=for-the-badge&logo=VisualStudioCode&logoColor=white"><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white"><img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=Bootstrap&logoColor=white"><img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white"><img src="https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=PM2&logoColor=white"><img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white"><img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=Three.js&logoColor=white">

<br>

___

<br>

### 🔑 프로젝트 진행 과정

<br>

> ### 24.03.06
>> #### project 생성

<br>

> ### 24.03.07
>> #### basic Manual 정립

<br>

> ### 24.03.12
>> #### 역할 분담 및 기술 토의

<br>

> ### 24.03.25
>> #### 요구 사항 확인 및 발표 완료

<br>

> ### 24.04.22
>> #### 중간 발표

<br>

> ### 24.05.13
>> #### Image Handler & 3D Function Testing

<img src="/images/3D_Handling.png">

<br>

___

> ### 24.06.03
>> #### 배너 & frontend 기본 틀 완성

<img src="/images/Frontend_1.png">
<img src="/images/Frontend_2.png">

<br>

___

<br>

> ### 24.06.17
>> #### 기말 발표

<br>

___

<br>

> ### 24.07.27
>> #### Board Basic 기능 구현

<img src="/images/myPage.png">
<img src="/images/myEditor.png">
<img src="/images/boardDetail.png">

<br>

___

<br>

> ### 24.08.13
>> #### WebGL Editor 기능 테스팅

<img src="/images/3D_Editor_Test.png">

<br>

___

<br>

> ### 24.09.23
>> #### 2학기 1차 발표

<br>

___

<br>

> ### 24.10.03
>> #### WebGL Editor 개편

<img src="/images/webgl.png">

<br>

___