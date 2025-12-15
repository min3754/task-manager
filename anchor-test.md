# GitHub 앵커 문법 테스트

이 파일은 GitHub에서 다양한 앵커 문법이 어떻게 작동하는지 테스트합니다.

---

## 테스트 링크 모음

아래 링크들이 정상 작동하는지 확인하세요:

| 테스트 | 링크 | 예상 결과 |
|--------|------|----------|
| 방식 1 | [kramdown 스타일](#test-kramdown) | 작동 여부 확인 |
| 방식 2 | [HTML id 스타일](#test-html-id) | 작동 여부 확인 |
| 방식 3 | [HTML name 스타일](#test-html-name) | 작동 여부 확인 |
| 방식 4 | [자동 생성 앵커](#방식-4-github-자동-생성-앵커) | 작동 여부 확인 |
| 방식 5 | [인라인 HTML](#test-inline) | 작동 여부 확인 |

---

## 방식 1: kramdown 스타일 {#test-kramdown}

Jekyll/kramdown에서 지원하는 `{#custom-id}` 문법입니다.

```markdown
## 헤딩 텍스트 {#custom-anchor}
```

이 섹션에 도달했다면 kramdown 스타일이 작동합니다.

---

<h2 id="test-html-id">방식 2: HTML id 속성</h2>

HTML `<h2 id="...">` 태그를 사용한 방식입니다.

```html
<h2 id="test-html-id">헤딩 텍스트</h2>
```

이 섹션에 도달했다면 HTML id 스타일이 작동합니다.

---

<h2><a name="test-html-name"></a>방식 3: HTML name 속성 (레거시)</h2>

HTML `<a name="...">` 앵커를 사용한 레거시 방식입니다.

```html
<h2><a name="test-html-name"></a>헤딩 텍스트</h2>
```

이 섹션에 도달했다면 HTML name 스타일이 작동합니다.

---

## 방식 4: GitHub 자동 생성 앵커

GitHub가 헤딩 텍스트에서 자동으로 생성하는 앵커입니다.

```markdown
## 방식 4: GitHub 자동 생성 앵커
→ 자동 생성: #방식-4-github-자동-생성-앵커
```

이 섹션에 도달했다면 자동 생성 앵커가 작동합니다.

---

<a id="test-inline"></a>

## 방식 5: 인라인 HTML 앵커

헤딩 앞에 별도의 `<a id="..."></a>` 태그를 배치하는 방식입니다.

```html
<a id="test-inline"></a>

## 헤딩 텍스트
```

이 섹션에 도달했다면 인라인 HTML 앵커가 작동합니다.

---

## 테스트 결과 기록

| 방식 | 문법 | 작동 여부 |
|------|------|:--------:|
| 1. kramdown | `{#id}` | ? |
| 2. HTML id | `<h2 id="">` | ? |
| 3. HTML name | `<a name="">` | ? |
| 4. 자동 생성 | (GitHub 기본) | ? |
| 5. 인라인 HTML | `<a id="">` + `##` | ? |

---

## 결론

GitHub에서 권장하는 앵커 방식:

1. **자동 생성 앵커** (기본, 별도 작업 불필요)
2. **HTML id 속성** (커스텀 앵커 필요 시)
3. **인라인 HTML 앵커** (마크다운 헤딩 유지 시)