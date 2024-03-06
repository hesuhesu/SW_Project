# 처음 생성 시 적용

- (필수) git 설치.

- (필수) github login 할 것

<br>

**1. 폴더 생성할 아무곳이나 마우스 우클릭 + Git bash here 클릭**

**2. 사용자 전역 등록**

```
git config --global user.name (user name)
ex) git config --global user.name hesuhesu

git config --global user.email (user email)
ex) git config --global user.email zndwk0728@gmail.com
```

**3. 원격 레포지토리 로컬 저장소로 가져오기**

```
git clone http://github.com/(user name)/(repository name)
ex) git clone http://github.com/hesuhesu/Git-chana
```

**4. 순차 입력**

```
cd (folder name)
ex) cd Git-chana

git remote // origin이 뜨면 합격
git add . // 여지껏 한 작업들 전부 한방에 이행
git status // 추가한 작업물 확인용

git commit -m "커밋메세지"
ex) git commit -m "add new files"

git push origin main // 왠만하면 성공하지만 오류가 난다면 "branch(master) 로 merge/push 등이 안될 때" 로..
```
___

# 처음이 아닐 때 적용

- 파일들 다 수정 후

**1. 해당 폴더에 마우스 오른쪽 우클릭 + Git bash here**

**2. 코드 순차 입력**

```
cd (folder name)
ex) cd Git-chana

git remote // origin이 뜨면 합격
git add . // 여지껏 한 작업들 전부 한방에 이행
git status // 추가한 작업물 확인용

git commit -m "(commit message)"
ex) git commit -m "add new files"

git push origin main // 왠만하면 성공하지만 오류가 난다면 "branch(master) 로 merge/push 등이 안될 때" 로..
```

___

# 원격 레포지토리에서 수정한 후 로컬 저장소에 적용하는 방법

```
git fetch origin
git merge origin/main
```

- !!만약 원격 레포지토리에서 수정한 후 로컬 저장소에서 수정하지 않고 commit 한다면
log 가 맞지않고 오류가 생기기 때문에 반드시 위의 코드 실행!!

 ___
 
# local repository에서 생성해서 원격 저장소로 보낼 때 사용하는 방법

- 해당 폴더에 마우스 오른쪽 우클릭 + Git bash here

```
git remote add origin https://github.com/(user name)/(repository name)
ex) git remote add origin https://github.com/hesuhesu/Git-chana

git remote
git add .
git status

git commit -m "(commit message)"
ex) git commit -m "add new files"

git push origin master
```

___

# branch(master) 로 merge/push 등이 안될 때

```
git checkout master
git branch main master -f
git checkout main
git push origin main -f
```
___ 

# github commit 잔디 적용 안된 상태일 때(중요도 하)

**따로 찾아보길 바람**

**git bash 내에서 복사 붙여넣기는 ctrl + c, v 와 다르다.**
- ctrl + insert // 복사
- shift + insert // 붙여넣기

```
git log --pretty=format:"%h = %an , %ar : %s" --graph // commit 안된 로그 찾기

git rebase -i -r (log name) // 해쉬코드로 rebase하기
ex) git rebase -i -r e82242a

git rebase -i -r --root // 최초의 자료로 이동.

git commit --amend --author="(user name) <(user email)>" 
ex) git commit --amend --author="hesuhesu <zndwk0728@gmail.com>"

:q
git rebase --continue
```

- 작업 끝날때까지 반복
