# Django Install Manual

### 1. 초기 설정

<br>

- (필수) python3 설치
- cmd 나 명령 프롬프트 실행 후 순차 진행 해볼 것

<br>

**1-1. 가상화 설치 및 환경 생성** 
```
cd \
pip install virtualenv
python -m virtualenv myenv
```

<br>

**1-2. 가상화 활성화**
```
C:\myenv\Scripts\activate
```

<br>

**1-3. PyCharm Install & Interpreter Setup**

- PyCharm 설치
- PyCharm 시작 화면에 open 에서 fork 한 local repository 의 backend 경로로 설정
- 실행 후 좌측 상단에 File - settings 실행

<img src = "/images/Python_Interpreter_Setup_1.png">

- Project:SW_Project 에서 Python Interpreter 클릭
- 우측에 Add Interpreter 클릭

<img src = "/images/Python_Interpreter_Setup_2.png">

- Environment Existing 으로 변경
- 우측에 ... 모양 클릭 후 경로창에 C:\myenv\Scripts\python.exe 입력하고 ok
- 나머지도 ok 하면 Interpreter setup 종료

<br>

**1-4. Django 설치 및 버전 확인**
```
pip install django
django-admin --version
```

<br>

**1-5. Django REST Framework 설치**
```
pip install djangorestframework
```

<br>

**1-6. Django REST Framework 토큰 기반 인증 구현 패키지 설치**
```
pip install djangorestframework djangorestframework-simplejwt
```

<br>

**1-7. Django REST Framework DRF Docs 설치**
```
pip install django-rest-framework-docs
```

<br>

**1-8. CORS(Crosss-Origin Resource Sharing) 설치**
```
pip install django-cors-headers
```

<br>

**1-9. 가상화 종료**
```
deactivate
```

<br>

___

### 2. 자주 쓰게 될 명령어

<br>

- 위의 설정이 끝났다면 PyCharm 터미널에서 작동하면 무난하게 사용된다
- PyCharm 의 터미널이 내가 fork 한 파일의 backend 폴더인지 확인하고 실행하자.
- 특별한 일이 없다면 해당 명령어만 PyCharm 터미널에 사용하여 실행할 것
```
python manage.py runserver // 종료시 ctrl+c
```

<br>

**2-1. 가상화 시작과 종료**

<br>

- 가상화 시작(실수로 가상화 종료 했을 때만 사용할 것)
```
C:\myenv\Scripts\activate
```

- 가상화 종료
```
deactivate
```

<br>

**2-2. Django 프로젝트 실행**

<br>

- 경로 선 이동
```
cd 본인 backend 폴더 경로
ex) cd C:\SW_Project\backend
```

- 프로젝트 실행
```
python manage.py runserver
```