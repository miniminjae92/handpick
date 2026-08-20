# Chrome Web Store listing copy

> 대시보드의 설명란은 마크다운을 렌더링하지 않는다. 붙여넣기는 평문 버전을 쓴다:
> [`store-listing-en.txt`](store-listing-en.txt) / [`store-listing-ko.txt`](store-listing-ko.txt).
> 이 문서를 고치면 평문 두 파일도 함께 갱신한다.
>
> 이름은 `extension/_locales/{en,ko}/messages.json`의 `extName`,
> 요약은 같은 파일의 `extDescription`이 정본이다. 여기 값이 그것과 어긋나면 안 된다.
> 상한: 이름 75자, 요약 132자.

## Name

Handpick: Copy any part of a page as Markdown or plain text

## Short description

Point at anything on a page and get clean Markdown. Tables, code, math and callouts survive. Copy, save .md, or send to Obsidian.

## Detailed description

Most web clippers guess where the article is. Handpick does not guess.

Hover to highlight any element on the page, press ↑ or ↓ to widen or narrow the selection, and the exact DOM subtree you picked becomes clean Markdown. Because nothing is inferred from the page's HTML structure, it works on pages that are not articles at all: AI chat answers, docs-site tables, GitHub issues, dashboards.

Copy it to the clipboard, download it as a `.md` file, or send it straight to an Obsidian vault. Plain text and HTML come out of the same selection.

### Key features

- Start a capture from the toolbar icon, or with Option + Shift + C (copy) / Option + Shift + S (save)
- Point at the exact part you want, then widen or narrow it with ↑ / ↓
- Save the selection as a `.md` file, or straight into an Obsidian vault
- Add optional source frontmatter (title, source URL, capture time) to saved notes
- Copy plain text or HTML from the same selection
- Choose Standard Markdown or Obsidian output, including supported callouts
- Preserve KaTeX/MathJax math as `$…$` / `$$…$$` LaTeX
- Resolve relative links and lazy-loaded images to real URLs
- Create a reviewable bug report draft when conversion fails
- Local, browser-side processing by default

### Useful for

- Saving AI answers into Obsidian, Notion, or Markdown notes
- Capturing only the exact section you want from a webpage
- Preserving tables, checklists, and code blocks more cleanly

### Privacy

Handpick only processes the part you explicitly point at. Selected HTML is not uploaded automatically, and bug reports are only shared when you review and submit them yourself.

## Korean short description

화면에서 가리킨 것을 그대로 읽을 수 있는 글로. Markdown 또는 일반 텍스트로 복사하고, .md로 저장하거나 Obsidian에 바로 보냅니다.

## Korean detailed description

대부분의 웹 클리퍼는 이 페이지의 본문이 어디인지 추측합니다. Handpick은 추측하지 않습니다.

마우스를 올려 페이지의 어떤 요소든 직접 짚고, ↑ 또는 ↓로 범위를 넓히거나 좁히면, 고른 DOM 하위 트리 그대로 깨끗한 Markdown이 됩니다. 페이지의 HTML 구조를 넘겨짚지 않으니 기사가 아닌 페이지에서도 됩니다. AI 답변, 문서 사이트의 표, 깃헙 이슈, 대시보드까지.

클립보드로 복사하거나, `.md` 파일로 내려받거나, Obsidian vault로 바로 보냅니다. 같은 선택에서 일반 텍스트와 HTML도 나옵니다.

### 주요 기능

- 툴바 아이콘 클릭 또는 Option + Shift + C(복사) / Option + Shift + S(저장)로 캡처 시작
- 원하는 부분을 직접 가리키고 ↑ / ↓로 선택 범위를 넓히거나 좁히기
- 선택한 내용을 `.md` 파일로 저장하거나 Obsidian vault로 바로 저장
- 저장할 노트에 출처 frontmatter(제목, 원본 URL, 캡처 시각) 추가 가능
- 같은 선택 결과에서 일반 텍스트 또는 HTML도 복사
- 지원되는 callout을 포함해 Standard Markdown 또는 Obsidian 출력 선택
- KaTeX/MathJax 수식을 `$…$` / `$$…$$` LaTeX로 보존
- 상대 링크와 lazy 이미지 주소를 실제 URL로 복원
- 변환이 이상하면 검토 가능한 버그 리포트 초안 생성
- 기본적으로 브라우저 안에서만 처리

### 이런 때 유용합니다

- AI 답변을 Obsidian, Notion, Markdown 노트로 옮길 때
- 웹 문서의 특정 섹션만 기록하고 싶을 때
- 표, 체크리스트, 코드 블록이 포함된 내용을 덜 깨지게 저장하고 싶을 때

### 개인정보

Handpick은 사용자가 직접 가리킨 부분만 처리합니다. 선택한 HTML은 자동으로 외부 전송되지 않으며, 버그 리포트도 사용자가 직접 확인하고 제출할 때만 외부로 전달됩니다.

## Suggested screenshot captions

1. Point at the exact part you want
2. Copy clean Markdown into your notes
3. Save directly as `.md`
4. Markdown, plain text, or HTML from one selection
5. Create reviewable bug reports when conversion fails
