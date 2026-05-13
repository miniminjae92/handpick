# F12 Copy Elements to MD

F12 개발자 도구에서 `Copy element`로 복사한 HTML을 Markdown으로 변환하는 단일 페이지 도구입니다.

브라우저 안에서만 동작하며 입력한 HTML은 서버로 전송되지 않습니다.

## 사용법

1. 변환하려는 웹페이지에서 개발자 도구를 엽니다.
2. Elements 탭에서 본문 영역을 선택합니다.
3. 선택한 요소를 우클릭한 뒤 `Copy` -> `Copy element`를 선택합니다.
4. 이 도구의 `HTML 입력` 칸에 붙여넣습니다.
5. 자동 변환된 Markdown을 복사하거나 `.md` 파일로 저장합니다.

## 본문 추출 기준

입력 HTML 안에서 주요 본문 후보를 우선순위로 찾고, 후보가 없으면 텍스트와 제목이 많은 영역을 자동으로 고릅니다.

1. `.tui-editor-contents`
2. `.notion-page-content`
3. `.markdown-body`, `.prose`, `.post-content`, `.entry-content`, `.article-content`
4. `[data-sourcepos]`, `[role="main"]`
5. `article`, `main`, `.content`

`.tui-editor-contents`나 `.notion-page-content`가 있는 HTML은 해당 영역을 우선 추출합니다.

## 변환 방식

기본 HTML -> Markdown 변환은 Turndown을 사용합니다. 변환 전에 Notion/Oopy처럼 화면용 `div`와 `span`이 많은 HTML에서 불필요한 요소를 정리합니다.

- 투명 `data:image/gif` 이모지 placeholder 제거
- Notion 텍스트 블록을 문단처럼 정리
- Notion 제목 블록을 제목 요소로 정리
- `script`, `style`, `nav`, `footer`, 버튼, 폼, 광고/공유 영역 제거
- 표와 task list 항목 보정

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
