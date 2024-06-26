# React & NodeJS Install Manual

### 1. 초기 설정

<br>

- (필수) Node 설치
- 명령어만 입력하는 간단한 작업이니 차례대로 이동하자. 사진 첨부했으니 참조하면 좋을 것

<br>

**1-1. npm 설정** 

- 해당 프로젝트는 package 파일에 npm modules 에 대한 정보가 다 담겨있음.
- frontend 폴더로 이동 후 터미널에서 다음의 명령어를 입력

```
npm install
```

- 이해를 위해 아래에 사진 첨부 

<img src = "/images/npm_Setup_1.png">

- 처음에 경로가 frontend 가 아닌 경우 cd ~ 처럼 경로를 이동이동하는 방법도 있지만 더 쉬운 방법을 밑에서 제시하겠음 선택되어 있는 "Open in Integrated Terminal" 을 선택하면 자동으로 해당 폴더의 터미널로 이동함

<img src = "/images/npm_Setup_2.png">

- 이후 프로젝트의 실행은 frontend 폴더의 터미널에서 아래의 명령어를 입력하자

```
npm start
```

<br>

**1-2. NodeJS 설정**

- 전부 세팅해두었다 명령어만 입력하면 실행된다.
- 간단하다 server 폴더에 해당 명령어를 입력하자
```
node server.js
```
- 위치를 이해하기 위한 사진 첨부

<img src = "/images/NodeJS_Setup_1.png">


<br>

### 2. 자주 쓰게 될 명령어

<br>

- 서버를 종료하는 명령어는 ctrl + c 이다. React, NodeJS 둘 다 같다
- NodeJS 의 실행 명령어이다
```
node server.js
```
- React 의 실행 명령어이다
```
npm start
```
- 업데이트가 진행된다면 React 에서 진행해야 할 명령어이다
```
npm install
```