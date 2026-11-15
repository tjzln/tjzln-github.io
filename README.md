# tjzln의 개발·보안 기록

사이트: https://tjzln.github.io/tjzln-github.io/

별도 설치나 빌드 없이 GitHub Pages에서 동작하는 정적 홈페이지입니다.
홈에는 카테고리가, 각 카테고리에는 해당 카테고리의 글이 표시됩니다.

## GitHub Pages 설정

Settings → Pages → Deploy from a branch → `main` → `/(root)`를 선택합니다.
`index.html`, `style.css`, `script.js`, `posts.js`, `favicon.svg`, `.nojekyll`을 함께 유지하세요.
모든 파일 경로가 상대 경로이므로 현재 프로젝트 주소에서 동작합니다.

## 글 추가하기

`posts.js`에 다음 형식으로 글을 추가한 뒤 커밋하세요. 아래 내용은 형식 예시입니다.

```js
window.ARCHIVE_POSTS = [
  {
    id: 'my-first-note',
    category: 'development',
    title: '직접 작성한 글의 제목',
    date: '2026-11-14',
    summary: '글 목록에 표시할 짧은 소개',
    body: `직접 작성한 본문을 여기에 적습니다.

줄바꿈도 그대로 표시됩니다.`,
    url: 'https://example.com/my-article' // 선택 사항: 실제 원문 주소
  }
];
```

`id`는 글마다 달라야 합니다. 날짜는 `YYYY-MM-DD` 형식입니다.
`body`는 기본적으로 일반 텍스트입니다. `format: 'markdown'`을 추가하면
제목, 문단, 굵은 글씨, HTTP(S) 주소, 목록, 구분선, 표를 표시할 수 있습니다.
HTML은 실행하지 않고 텍스트로 표시합니다. 코드 블록과 이미지 문법은 아직 지원하지 않습니다.
ASK 2026 글의 원문은 `articles/ask-2026-source-code-representation.md`에 보관하며,
사이트에서 표시하는 내용은 `posts.js`의 해당 글 `body`입니다. 수정 시 두 파일을 함께 갱신하세요.
외부 블로그 글은 `summary`와 `url`로 연결할 수도 있습니다.
각 카테고리의 글은 최신 날짜순으로 정렬됩니다.
게시글이나 표시 코드를 변경하면 `index.html`의 `posts.js`, `script.js`, `style.css` 주소에 붙은
`v=` 값도 새 버전으로 변경하세요. 브라우저에 이전 파일이 남아 글이 누락되는 것을 방지합니다.
문자열에 따옴표나 백틱을 포함할 때는 JavaScript 문법에 맞게 이스케이프하세요.

| 카테고리 | category 값 |
| --- | --- |
| 개발 | `development` |
| CTF/Wargame | `ctf-wargame` |
| Bug Bounty | `bug-bounty` |
| 블로그/기술문서 | `technical-writing` |
| 논문/컨퍼런스 | `research` |
| 공모전/자격증 | `achievements` |
| 진행상황 | `progress` |

## 디자인 수정 및 미리보기

`style.css`의 `:root`에서 색상을, `script.js`에서 카테고리 설명을,
`index.html`에서 메인 소개 문구를 바꿀 수 있습니다.
`index.html`을 브라우저로 직접 열면 미리 볼 수 있습니다.
