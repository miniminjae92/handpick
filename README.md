# F12 Copy Element to Markdown

F12 개발자 도구에서 `Copy element`로 복사한 HTML을 Markdown으로 변환하는 단일 페이지 도구입니다.

브라우저 안에서만 동작하며 입력한 HTML은 서버로 전송되지 않습니다.

## 사용법

1. 변환하려는 웹페이지에서 개발자 도구를 엽니다.
2. Elements 탭에서 본문 영역을 선택합니다.
3. 선택한 요소를 우클릭한 뒤 `Copy` -> `Copy element`를 선택합니다.
4. 이 도구의 `HTML 입력` 칸에 붙여넣습니다.
5. 자동 변환된 Markdown을 복사하거나 `.md` 파일로 저장합니다.

## 본문 추출 기준

입력 HTML 안에서 아래 순서로 변환할 본문을 찾습니다.

1. `.tui-editor-contents`
2. `[data-sourcepos]`
3. `article`
4. `main`
5. `body`

`.tui-editor-contents`가 있는 HTML은 해당 영역만 자동으로 추출합니다.

## 지원하는 변환

- 제목: `h1`부터 `h6`
- 문단과 줄바꿈
- 굵게, 기울임, 취소선
- 링크와 이미지
- 순서 목록, 비순서 목록, 중첩 목록
- 코드, 코드 블록
- 인용문
- 표
- 구분선

## 한계

이 도구는 게시글 본문을 빠르게 Markdown 초안으로 바꾸는 용도입니다. 모든 HTML과 모든 Markdown 확장 문법을 완벽하게 보존하지는 않습니다.
