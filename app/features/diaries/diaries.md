# `diaries` 기능 구조 및 데이터 흐름 설명

이 문서는 MindLog 애플리케이션의 핵심 기능인 '일기(diaries)' 기능의 기술적 구조와 데이터 흐름을 설명합니다. 코드를 처음 접하는 분들도 이해할 수 있도록 각 파일의 역할과 사용자 행동에 따른 코드의 상호작용 과정을 상세히 기술했습니다.

## 1. 디렉토리 및 파일 구조

`diaries` 기능 관련 코드는 `app/features/diaries/` 디렉토리 내에 모여있습니다. 각 파일의 역할은 다음과 같습니다.

- **`/pages/diary-list.tsx`**: 모든 일기 목록을 보여주는 메인 페이지입니다. 여러 하위 컴포넌트를 조합하고, 페이지의 전체적인 상태(필터, 정렬 등)를 관리하는 '컨테이너' 역할을 합니다.
- **`/pages/new-diary.tsx`**: 새 일기를 작성하는 페이지입니다. 일기 작성 폼(`SteppedDiaryForm`)을 화면에 보여주고, 최종적으로 '저장' 로직을 처리합니다.
- **`/components/diary-card.tsx`**: 일기 목록에 표시되는 개별 '일기 카드' UI입니다. 일기 하나의 요약 정보를 보여줍니다.
- **`/components/diary-calendar.tsx`**: 날짜를 선택하여 특정 날짜의 일기를 필터링할 수 있는 캘린더 UI입니다.
- **`/components/diary-filters.tsx`**: 검색, 정렬, 감정, 작성 상태 등 다양한 조건으로 일기 목록을 필터링하는 UI입니다.
- **`/components/stepped-diary-form.tsx`**: 여러 단계로 구성된 일기 작성 폼 UI입니다. 사용자가 일기를 쉽게 작성할 수 있도록 안내하는 역할을 합니다.
- **`/components/emotion-tag-selector.tsx`**: `stepped-diary-form` 내에서 감정 태그를 선택하고 새로 만드는 UI 컴포넌트입니다.
- **`/components/empty-state.tsx`**: 목록에 표시할 일기가 없을 때 (검색 결과가 없거나, 작성된 일기가 아예 없는 경우) 사용자에게 상황을 알려주는 UI입니다.
- **`schema.ts`**: Drizzle ORM을 사용하여 데이터베이스의 `diaries` 테이블과 `diary_tags` 테이블 구조를 코드로 정의한 파일입니다.
- **`index.ts`**: `diaries` 폴더 내의 모든 컴포넌트와 페이지를 다른 곳에서 쉽게 가져다 쓸 수 있도록 모아서 내보내는 '대문' 역할을 합니다.

---

## 2. 사용자 행동에 따른 데이터 흐름 및 동작 과정

사용자의 특정 행동이 어떤 코드의 흐름을 통해 화면에 반영되는지 시나리오별로 설명합니다.

### 시나리오 1: 일기 목록 페이지 접속

1.  **사용자 행동**: 브라우저 주소창에 `/diary`를 입력하거나 해당 링크를 클릭합니다.
2.  **라우터 동작**: React Router가 요청을 받아, `app/routes.ts`에 정의된 설정에 따라 `/diary` 경로와 연결된 `diary-list.tsx` 컴포넌트를 화면에 렌더링하기로 결정합니다.
3.  **`diary-list.tsx` 렌더링**:
    - `DiaryListPage` 컴포넌트가 실행됩니다.
    - `useState`를 통해 필터링/정렬에 필요한 모든 상태(`searchQuery`, `sortBy`, `selectedDate` 등)를 초기값으로 만듭니다.
    - (현재는 임시 데이터인) `mockDiaryEntries` 배열을 기반으로, `useMemo`를 사용하여 화면에 표시할 `filteredAndSortedEntries` 배열을 계산합니다. 처음에는 필터가 없으므로 모든 일기가 기본 정렬 순서(최신순)로 포함됩니다.
    - 계산된 일기 목록과 상태, 그리고 상태를 변경할 함수들(`setSearchQuery` 등)을 각각의 하위 컴포넌트(`DiaryFilters`, `DiaryCalendar`, `DiaryCard`)에 **props**로 전달하며 화면을 그립니다.

> **핵심 개념: Props**
> Props는 부모 컴포넌트가 자식 컴포넌트에게 데이터를 전달하는 방법입니다. 마치 함수에 인자를 전달하는 것과 같습니다. 이를 통해 `diary-list.tsx`라는 부모가 모든 데이터를 관리하고, 자식들은 그 데이터를 받아 화면에 표시하거나, 부모가 전달해준 함수를 호출하여 상태 변경을 요청합니다.

### 시나리오 2: 캘린더에서 특정 날짜 클릭

1.  **사용자 행동**: `DiaryCalendar` 컴포넌트에서 특정 날짜(예: 15일)를 클릭합니다.
2.  **`DiaryCalendar` 컴포넌트 동작**:
    - 캘린더의 `onSelect` 이벤트가 발생합니다.
    - 이 이벤트는 부모(`diary-list.tsx`)로부터 받은 `onDateSelect` 함수를 호출합니다.
3.  **`diary-list.tsx` 상태 업데이트**:
    - `DiaryListPage`에서 `onDateSelect` prop으로 넘겨준 것은 `setSelectedDate` 함수입니다.
    - `setSelectedDate(선택된_날짜)`가 실행되면서 `selectedDate` 상태가 새로운 날짜로 업데이트됩니다.
4.  **리렌더링 및 목록 필터링**:
    - `selectedDate` 상태가 변경되었으므로, `DiaryListPage` 컴포넌트가 **리렌더링(re-rendering)**됩니다.
    - `useMemo`의 의존성 배열(`dependency array`)에 `selectedDate`가 포함되어 있으므로, `filteredAndSortedEntries`를 다시 계산합니다.
    - 이번 계산에서는 `if (selectedDate)` 조건문이 참이 되어, 전체 일기 목록에서 `selectedDate`와 날짜가 일치하는 일기만 필터링하여 새로운 배열을 만듭니다.
5.  **결과**: 화면의 일기 목록 부분이 업데이트되어 15일에 작성된 일기만 표시됩니다.

### 시나리오 3: 검색창에 "프로젝트" 입력

1.  **사용자 행동**: `DiaryFilters` 컴포넌트의 검색창(`Input`)에 "프로젝트"라고 타이핑합니다.
2.  **`DiaryFilters` 컴포넌트 동작**:
    - `Input`의 `onChange` 이벤트가 키를 누를 때마다 발생합니다.
    - 이벤트 핸들러는 부모(`diary-list.tsx`)로부터 받은 `onSearchChange` 함수를 호출합니다.
3.  **`diary-list.tsx` 상태 업데이트**:
    - `onSearchChange` prop으로 넘겨준 것은 `setSearchQuery` 함수입니다.
    - `setSearchQuery("프로젝트")`가 실행되어 `searchQuery` 상태가 업데이트됩니다.
4.  **리렌더링 및 목록 필터링**:
    - `searchQuery` 상태가 변경되었으므로, `DiaryListPage` 컴포넌트가 리렌더링됩니다.
    - `useMemo`가 `filteredAndSortedEntries`를 다시 계산합니다.
    - `if (searchQuery)` 조건문이 참이 되고, `filter` 메소드를 통해 일기의 `shortContent`, `situation`, `reaction` 필드에 "프로젝트"라는 단어가 포함된 일기만 남깁니다.
5.  **결과**: 화면의 일기 목록이 "프로젝트"가 포함된 일기만 보여주도록 실시간으로 업데이트됩니다.

### 시나리오 4: 새 일기 작성

1.  **사용자 행동**: `diary-list.tsx` 페이지에서 '새 일기 쓰기' 버튼을 클릭합니다.
2.  **라우터 동작**: `<Link to='/diary/new'>` 컴포넌트에 의해 브라우저의 주소가 `/diary/new`로 변경되고, React Router는 `new-diary.tsx` 컴포넌트를 렌더링합니다.
3.  **`new-diary.tsx` 렌더링**:
    - `NewDiaryPage` 컴포넌트는 `SteppedDiaryForm` 컴포넌트를 렌더링합니다.
    - 이때, 일기 제출 시 실행될 `handleSubmit` 함수를 `onSubmit`이라는 prop으로 `SteppedDiaryForm`에 전달합니다.
4.  **`SteppedDiaryForm` 동작**:
    - 사용자는 여러 단계에 걸쳐 폼을 작성합니다. (감정 선택, 내용 입력 등)
    - 사용자가 입력하는 모든 데이터는 `SteppedDiaryForm` 컴포넌트가 자체적으로 관리하는 `formData` 상태에 저장됩니다.
5.  **사용자 행동**: 마지막 단계에서 '완료하기' 버튼을 클릭합니다.
6.  **`SteppedDiaryForm`의 제출 처리**:
    - '완료하기' 버튼의 `onClick` 이벤트 핸들러가 실행됩니다.
    - 이 핸들러는 부모(`new-diary.tsx`)로부터 받은 `onSubmit` 함수를 호출하면서, 자신이 관리하던 `formData` 상태를 인자로 전달합니다.
7.  **`new-diary.tsx`의 최종 저장**:
    - `NewDiaryPage`의 `handleSubmit` 함수가 `formData`를 받아서 실행됩니다.
    - `setIsLoading(true)`를 통해 로딩 상태를 활성화합니다.
    - (미래에 구현될) `fetch`나 `axios` 같은 함수를 사용하여 서버 API로 `formData`를 전송합니다.
    - API 호출이 성공적으로 완료되면, `useNavigate` Hook을 사용하여 사용자를 다시 일기 목록 페이지(`/diary`)로 이동시킵니다.
8.  **결과**: 사용자는 새로 작성한 일기가 포함된 일기 목록 페이지를 보게 됩니다.

---

이처럼 React 컴포넌트들은 각자의 역할을 가지고 **Props**를 통해 부모-자식 관계를 맺으며 데이터를 주고받습니다. 사용자의 행동은 이벤트를 발생시키고, 이벤트 핸들러는 상태(State)를 변경합니다. 상태가 변경되면 컴포넌트는 리렌더링되어 화면이 업데이트되는 것이 React 애플리케이션의 핵심적인 동작 원리입니다.
