// src/app/features/diaries/index.ts

/**
 * ## 파일 흐름 및 역할
 *
 * 이 파일은 'diaries' 기능 모듈의 "대문" 역할을 합니다.
 * 'diaries' 디렉토리 내의 여러 컴포넌트와 페이지들을 다른 파일에서 쉽게 가져다 쓸 수 있도록
 * 한 곳에서 모아서 내보내(export)주는 역할을 합니다.
 *
 * ## 코드 구조 및 원리
 *
 * - `export { ... } from './path/to/file';` 구문을 사용합니다.
 * - 이렇게 하면 다른 파일에서 컴포넌트를 가져올 때, 각 컴포넌트의 실제 파일 경로를 일일이 알 필요 없이
 *   이 `index.ts` 파일이 있는 디렉토리 경로만으로 여러 컴포넌트를 가져올 수 있습니다.
 *
 *   예시 (이렇게 사용 가능):
 *   `import { DiaryCard, DiaryCalendar } from '~/features/diaries';`
 *
 *   예시 (이렇게 안 해도 됨):
 *   `import { DiaryCard } from '~/features/diaries/components/diary-card';`
 *   `import { DiaryCalendar } from '~/features/diaries/components/diary-calendar';`
 *
 * - 이 방식은 코드의 유지보수성을 높여주고, import 구문을 더 깔끔하게 만들어줍니다.
 *   프로젝트 구조가 명확해지는 장점도 있습니다.
 */

// --- 컴포넌트 내보내기 ---
export { EmotionTagSelector } from "./components/emotion-tag-selector";
export { SteppedDiaryForm } from "./components/stepped-diary-form";
export { DiaryCalendar } from "./components/diary-calendar";
export { DiaryCard } from "./components/diary-card";
export { DiaryFilters } from "./components/diary-filters";
export { EmptyState } from "./components/empty-state";

// --- 페이지 컴포넌트 내보내기 ---
// `export default as ...`는 `export { default as ... }`의 축약형입니다.
// 다른 파일에서 `import { NewDiaryPage } from ...` 와 같이 이름을 지정하여 가져올 수 있게 해줍니다.
export { default as NewDiaryPage } from "./pages/new-diary";
export { default as DiaryListPage } from "./pages/diary-list";
