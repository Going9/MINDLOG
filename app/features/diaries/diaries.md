이 컴포넌트는 하나의 잘 짜인 '데이터 공장'과 같습니다. 원재료가 들어와서, 여러 기계(상태, 계산)를 거쳐, 최종 제품(UI)이 조립되고, 사용자의 요구에 따라 실시간으로 제품을 바꿔나가는 과정이죠.

---

### \#\# 데이터 흐름의 전체 여정 🗺️

1.  **원재료 입고 (`loader` 함수)**: 사용자가 페이지에 접속하기 전, 서버에서 원재료(일기, 감정 태그)를 가져옵니다.
2.  **공장 준비 (`useState`)**: 공장에 원재료를 쌓아두고, 사용자가 조작할 수 있는 여러 개의 '조정 레버'를 준비합니다.
3.  **자동화 기계 (`useMemo`)**: '조정 레버'의 상태에 따라 원재료를 자동으로 가공하여 중간 제품들을 만듭니다.
4.  **제품 조립 (`return`과 Props)**: 가공된 제품들을 이용해 최종 UI를 조립하고, '조정판' 역할을 하는 자식 컴포넌트에게 레버와 현재 상태를 연결해 줍니다.
5.  **사용자 조작 (순환)**: 사용자가 '조정판'의 레버를 당기면, 공장 전체가 이 변화에 맞춰 새로운 제품을 즉시 생산해냅니다.

---

### \#\# 1단계: 원재료 입고 (서버에서 데이터 가져오기 - `loader`)

```javascript
export const loader = async () => {
  const profileId = "b0e0e902-3488-4c10-9621-fffde048923c";

  const [diaries, emotionTags] = await Promise.all([
    getDiaries(profileId),
    getEmotionTags(profileId),
  ]);

  return { diaries, emotionTags };
};
```

- **흐름**: 이 코드는 컴포넌트가 화면에 그려지기 **전**에 실행됩니다.
- **역할**: `async/await`과 `Promise.all`을 사용해 데이터베이스로부터 두 종류의 핵심 데이터, 즉 모든 **일기 목록**과 모든 **감정 태그 목록**을 효율적으로 동시에 가져옵니다.
- **결과**: `diaries`와 `emotionTags`라는 순수한 '원재료' 덩어리가 준비됩니다.

---

### \#\# 2단계: 공장 준비 (데이터 도착 및 '조정 레버' - `useState`)

```javascript
export default function DiaryListPage({ loaderData }: Route.ComponentProps) {
  const { diaries, emotionTags } = loaderData;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  // ... other states
}
```

- **흐름**: 컴포넌트가 처음 실행될 때, `loader`가 준비한 원재료를 `loaderData`라는 prop을 통해 전달받습니다.
- **역할**: `useState`를 통해 사용자가 제어할 여러 '조정 레버'를 만듭니다. `searchQuery`(검색어), `sortBy`(정렬 기준), `selectedDate`(선택 날짜) 등이 그것들이죠. 각각 기본값으로 초기화됩니다.

---

### \#\# 3단계: 자동화 기계 (데이터 가공 - `useMemo`)

이제 원재료와 조정 레버의 값을 조합해 실제 화면에 필요한 데이터를 계산합니다.

1.  **`availableEmotions` (사용된 감정 목록 계산)**
    - **입력**: `diaries`, `emotionTags` (원재료)
    - **역할**: `useMemo`를 사용해, 전체 일기 목록을 훑어 사용자가 **실제로 사용한** 감정들만 추려냅니다. 필터 드롭다운에 불필요한 옵션을 보여주지 않기 위함이죠. `diaries`나 `emotionTags`가 바뀌지 않는 한 다시 계산되지 않습니다.

2.  **`filteredAndSortedEntries` (최종 일기 목록 계산)**
    - **입력**: `diaries` (원재료) + `searchQuery`, `sortBy` 등 모든 `useState` 레버 값들
    - **역할**: 이 공장의 **메인 엔진**입니다. `useMemo`가 모든 '조정 레버'의 값을 감시하고 있다가, 어느 하나라도 바뀌면 즉시 작동합니다. 원본 `diaries` 배열을 가져와 검색, 감정, 날짜 등 현재 레버 값에 맞춰 순차적으로 필터링하고, 마지막으로 정렬 기준에 맞춰 순서를 정리합니다.
    - **결과**: 화면에 표시될 **최종 일기 목록**이 완성됩니다.

---

### \#\# 4단계: 제품 조립 (화면 그리기 - `return`과 Props)

```jsx
return (
  // ...
  <DiaryFilters
    searchQuery={searchQuery}
    onSearchChange={setSearchQuery}
    // ... other props
  />
  // ...
  {filteredAndSortedEntries.map(entry => (
    <DiaryCard key={entry.id} entry={entry} ... />
  ))}
  // ...
)
```

- **흐름**: `return` 구문은 계산된 모든 데이터를 사용해 최종 UI를 조립합니다.
- **`DiaryFilters` (조정판)**: 이 자식 컴포넌트에게 **현재 레버의 값**(`searchQuery={searchQuery}`)과 **레버를 조작할 함수**(`onSearchChange={setSearchQuery}`)를 props로 넘겨줍니다. `DiaryFilters`는 이들을 받아 화면에 보여주고, 사용자 입력을 부모에게 전달하는 역할만 수행합니다.
- **`DiaryCard` (최종 제품)**: **가장 중요합니다.** 원본 `diaries`가 아닌, 모든 필터링과 정렬이 끝난 최종 결과물 \*\*`filteredAndSortedEntries`\*\*를 기반으로 일기 카드를 그립니다.

---

### \#\# 5단계: 사용자와의 상호작용 (데이터 흐름의 순환)

이 모든 것이 어떻게 유기적으로 연결되는지, 사용자가 검색하는 시나리오로 최종 정리해 보겠습니다.

1.  **사용자**: `DiaryFilters`의 검색창에 '프로젝트'라고 입력합니다.
2.  **`DiaryFilters`**: `onChange` 이벤트가 발생하고, 부모에게 받은 `onSearchChange("프로젝트")` 함수를 호출합니다.
3.  **`DiaryListPage`**: `setSearchQuery("프로젝트")`가 실행되어 `searchQuery` 상태가 변경됩니다.
4.  **리액트**: 상태 변경을 감지하고 `DiaryListPage` 컴포넌트를 리렌더링합니다.
5.  **`useMemo`**: 리렌더링 중 `filteredAndSortedEntries`의 `useMemo`가 자신의 감시 목록에서 `searchQuery`가 변경된 것을 확인하고, **재계산**을 시작합니다. '프로젝트'라는 단어가 포함된 일기만 남기고 모두 걸러낸 새로운 배열을 만듭니다.
6.  **`return`**: `return` 구문이 다시 실행됩니다.
    - `filteredAndSortedEntries.map(...)`은 이제 **더 적은 수의 일기**를 가지고 `DiaryCard`를 그립니다.
    - `DiaryFilters`는 `searchQuery="프로젝트"`라는 새로운 prop을 받아 검색창에 '프로젝트'라는 글자를 그대로 표시합니다.
7.  **최종 결과**: 사용자는 검색창에 '프로젝트'가 입력된 상태와, 그에 맞게 필터링된 일기 목록을 즉시 화면에서 보게 됩니다.

이것이 바로 `loader`부터 `useState`, `useMemo`, `props`를 거쳐 최종 UI에 이르렀다가, 다시 사용자 입력으로 거슬러 올라가는 리액트의 완전한 데이터 흐름입니다.
