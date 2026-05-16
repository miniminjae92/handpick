# Element to Markdown

웹페이지에서 내가 직접 고른 요소를 Markdown으로 빠르게 복사하거나 저장하는 Chrome 확장프로그램입니다.

AI가 만든 답변이나 웹상의 좋은 정보를 개인 기록으로 옮길 때, 일반 복사보다 제목·목록·표·코드 블록이 덜 깨지도록 정리합니다. 선택한 내용은 기본적으로 브라우저 안에서만 처리됩니다.

## 데모 영상

원하는 영역을 직접 고르고, 구조를 덜 잃은 채 Markdown으로 옮깁니다.

### Save AI answers into my notes

<video src="https://github.com/user-attachments/assets/44630d9d-ac3e-4e6b-b1b1-058e1a8d0335" controls></video>

<details>
<summary>More demos</summary>

### Capture useful web content as Markdown

<video src="https://github.com/user-attachments/assets/c581f208-78ff-4931-994f-8a883363ef45" controls></video>

### Copy selected content as plain text

<video src="https://github.com/user-attachments/assets/40ba7c02-7f36-4336-a0b0-c38cd83cc744" controls></video>

### Select only the exact element you want

<video src="https://github.com/user-attachments/assets/7449c351-b971-464c-a9cc-d04745eef2c4" controls></video>

### Report a conversion issue

<video src="https://github.com/user-attachments/assets/43a8b267-50b3-4ae1-bcea-f50e91af8a14" controls></video>

</details>

## 주요 기능

- `Option + Shift + C`: 선택한 요소를 Markdown으로 복사
- `Option + Shift + S`: 선택한 요소를 `.md` 파일로 저장
- Chrome 단축키 관리 화면에서 `Copy plain text`를 포함한 각 액션의 단축키를 직접 지정 가능
- 선택 후 토스트에서:
  - Markdown 저장
  - plain text 복사
  - HTML 복사
  - 버그 리포트 초안 열기
- Notion, Oopy, AI 응답 페이지처럼 구조가 복잡한 HTML도 최대한 읽기 좋은 Markdown으로 정리
- 출력 포맷 선택:
  - `Standard Markdown`
  - `Obsidian` callout 지원

## 사용법

### Chrome 확장프로그램

1. Chrome에서 확장프로그램을 설치합니다.
2. 원하는 웹페이지에서:
   - `Option + Shift + C`를 누르면 복사 모드
   - `Option + Shift + S`를 누르면 저장 모드
3. 마우스로 원하는 요소를 직접 고릅니다.
4. 클릭하면 즉시 복사 또는 저장됩니다.
5. 완료 후 뜨는 토스트에서 필요하면 plain text, HTML, 버그 리포트 기능을 이어서 사용할 수 있습니다.
6. callout을 Obsidian 문법으로 보존하고 싶다면 확장프로그램 옵션에서 `Obsidian`을 선택합니다.
7. 단축키는 확장프로그램 옵션의 `Manage keyboard shortcuts` 또는 `chrome://extensions/shortcuts`에서 변경할 수 있습니다.

### 개발 중 로컬 설치

1. Chrome에서 `chrome://extensions`를 엽니다.
2. 우상단 `개발자 모드`를 켭니다.
3. `압축해제된 확장 프로그램을 로드`를 누릅니다.
4. 이 저장소의 `extension/` 폴더를 선택합니다.

## 버그 리포트 보내기

변환이 이상한 경우:

1. 요소를 선택한 뒤 토스트에서 `Report issue`를 누릅니다.
2. 열린 리포트 페이지에서 선택 HTML과 변환 결과를 확인합니다.
3. 민감한 정보가 있으면 직접 삭제합니다.
4. `Download debug case`로 `debug-case.json`을 저장합니다.
5. `Open GitHub issue`를 눌러 이슈를 열고 파일을 첨부합니다.

리포트 초안은 사용자가 직접 전송하기 전까지 외부로 자동 업로드되지 않습니다.

## 웹 버전

기존 웹 버전도 유지합니다. F12 개발자 도구에서 `Copy element` 한 HTML을 붙여넣어 Markdown으로 변환할 수 있습니다.

웹 버전이 더 편한 경우:

- 확장프로그램을 설치할 수 없는 환경
- 이미 HTML 조각을 가지고 있는 경우
- 변환 결과를 별도 화면에서 직접 확인하고 싶은 경우

## 개발용 도구

- `dev.html`: 문제 HTML을 붙여넣고 렌더링, Markdown, plain text 출력을 확인한 뒤 `debug-case.json`으로 저장
- `fixtures/`: 수정 후 재발 방지용 최소 재현 케이스
- `fixtures.html`: 저장된 fixture의 기대 출력과 현재 출력을 비교

공용 변환 로직을 수정한 뒤에는 아래 스크립트로 확장프로그램용 복사본을 갱신합니다.

```bash
./scripts/sync-extension-assets.sh
```

## 변환 방식

기본 HTML → Markdown 변환은 Turndown을 사용합니다. 변환 전에 화면용 래퍼나 불필요한 요소를 정리합니다.

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

## 개인정보

이 확장은 사용자가 직접 실행하고 클릭한 요소만 처리합니다. 선택한 HTML은 자동으로 외부 전송되지 않으며, 버그 리포트도 사용자가 직접 확인하고 제출할 때만 외부로 전달됩니다.

자세한 내용은 `docs/privacy.md`를 참고하세요.

## 후원

이 도구가 시간을 아껴줬다면, 향후 후원 링크를 통해 개발을 응원할 수 있습니다.

## 기여

- 버그 리포트: `CONTRIBUTING.md`
- 릴리스 절차: `docs/release-checklist.md`
- 변경 내역: `CHANGELOG.md`

## 한계

이 도구는 웹의 다양한 HTML을 빠르게 개인 기록용 Markdown 초안으로 옮기는 용도입니다. 모든 HTML과 모든 Markdown 확장 문법을 완벽하게 보존하지는 않습니다.
