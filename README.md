# F12 Copy Elements to MD

F12 개발자 도구에서 `Copy element`로 복사한 HTML을 Markdown으로 변환하는 단일 페이지 도구입니다.

브라우저 안에서만 동작하며 입력한 HTML은 서버로 전송되지 않습니다.

## Chrome 확장프로그램

`extension/` 폴더에는 **Element to Markdown** Chrome 확장프로그램 v1이 들어 있습니다.

- `Option + Shift + C`: 요소를 직접 고른 뒤 Markdown으로 복사
- `Option + Shift + S`: 요소를 직접 고른 뒤 `.md` 파일로 저장
- 복사/저장 뒤 뜨는 토스트에서 같은 선택 결과를 plain text로도 복사할 수 있습니다.

개발 중에는 Chrome의 `chrome://extensions`에서 개발자 모드를 켠 뒤 `압축해제된 확장 프로그램을 로드`로 `extension/` 폴더를 선택해 사용할 수 있습니다.

공용 변환 로직을 수정한 뒤에는 아래 스크립트로 확장프로그램용 복사본을 갱신합니다.

```bash
./scripts/sync-extension-assets.sh
```

## 개발용 페이지

- `dev.html`: 문제 HTML을 붙여넣고 렌더링, Markdown, plain text 출력을 확인한 뒤 `debug-case.json`으로 저장
- `fixtures.html`: 저장된 fixture의 기대 출력과 현재 출력을 비교

## 사용법

1. 변환하려는 웹페이지에서 개발자 도구를 엽니다.
2. Elements 탭에서 본문 영역을 선택합니다.
3. 선택한 요소를 우클릭한 뒤 `Copy` -> `Copy element`를 선택합니다. (우클릭 없이 `Ctrl + c` or `Cmd + c`도 가능합니다.)
4. 이 도구의 `HTML 입력` 칸에 붙여넣습니다.
5. 자동 변환된 Markdown을 복사하거나 `.md` 파일로 저장합니다.

## 데모 영상

[데모 영상 보기](https://github.com/user-attachments/assets/e898b235-fadf-422d-829c-ef2662abb14d)

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

- Notion 이모지와 투명 `data:image/gif` placeholder의 텍스트/alt 보존
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
