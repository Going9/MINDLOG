# 일기 기능 상세 설명서 (초보자용)

안녕하세요! 이 문서는 리액트와 타입스크립트를 처음 접하는 자바 개발자를 위한 상세한 설명서입니다. 
고등학교 수준에서도 이해할 수 있도록 쉽고 자세하게 설명하겠습니다.

## 🎯 전체적인 그림 이해하기

### 1. 웹 애플리케이션의 구조
일반적인 자바 웹 애플리케이션과 비교해보겠습니다:

**자바 웹 애플리케이션:**
```
브라우저 ↔ 서버(Spring Boot) ↔ 데이터베이스(MySQL)
```

**리액트 웹 애플리케이션:**
```
브라우저(React) ↔ 서버(Node.js) ↔ 데이터베이스(PostgreSQL)
```

### 2. 파일 구조와 역할
```
app/features/diaries/
├── schema.ts          # 데이터베이스 테이블 정의 (자바의 Entity 클래스와 유사)
├── queries.ts         # 데이터베이스 조회 함수 (자바의 Repository와 유사)  
├── pages/
│   └── diary-list.tsx # 일기 목록 화면 (자바의 Controller + JSP와 유사)
└── components/
    └── diary-card.tsx # 개별 일기 카드 컴포넌트 (재사용 가능한 UI 조각)
```

## 📊 데이터베이스 이해하기

### seed.sql 데이터 예시
실제 데이터베이스에 들어있는 데이터를 살펴보겠습니다:

```sql
-- 감정 태그 테이블
INSERT INTO "emotion_tags" VALUES
(1, null, '기쁨', '#10B981', 'positive', true),
(2, null, '행복', '#3B82F6', 'positive', true),
(11, 'b0e0e902-3488-4c10-9621-fffde048923c', '성취감', '#4CAF50', 'positive', false);

-- 일기 테이블  
INSERT INTO "diaries" VALUES
(1, 'b0e0e902-3488-4c10-9621-fffde048923c', '2025-09-15', 
 '새로운 프로젝트를 시작한 흥미진진한 하루', 
 '오늘 새로운 웹 개발 프로젝트를 시작했다.', 
 '처음엔 걱정이 많았지만 차근차근 해나가니 할 수 있을 것 같다.');

-- 일기-감정태그 연결 테이블
INSERT INTO "diary_tags" VALUES
(1, 1, 1), -- 일기1번에 기쁨 태그
(2, 1, 4); -- 일기1번에 설렘 태그
```

## 🗂️ 스키마 (Schema) 이해하기

스키마는 데이터베이스 테이블의 구조를 정의하는 파일입니다. 자바의 Entity 클래스와 비슷한 역할을 합니다.

### diaries 테이블 구조
```typescript
export const diaries = pgTable("diaries", {
  id: bigint("id").primaryKey(),                    // 일기 고유번호 (1, 2, 3...)
  profileId: uuid("profile_id").notNull(),          // 작성자 ID
  date: date("date").notNull(),                     // 일기 작성 날짜
  shortContent: text("short_content"),              // 한 줄 요약
  situation: text("situation"),                     // 상황 설명
  reaction: text("reaction"),                       // 감정적 반응
  physicalSensation: text("physical_sensation"),   // 신체적 감각
  desiredReaction: text("desired_reaction"),        // 원했던 반응
  gratitudeMoment: text("gratitude_moment"),       // 감사한 순간
  selfKindWords: text("self_kind_words"),          // 자신에게 하고 싶은 말
});
```

**자바와 비교:**
```java
@Entity
public class Diary {
    @Id
    @GeneratedValue
    private Long id;
    
    private String profileId;
    private LocalDate date;
    private String shortContent;
    // ... 기타 필드들
}
```

### emotion_tags 테이블 구조
```typescript
export const emotionTags = pgTable("emotion_tags", {
  id: bigint("id").primaryKey(),                    // 태그 고유번호
  name: text("name").notNull(),                     // 태그 이름 (예: '기쁨', '슬픔')
  color: text("color").default("#6B7280"),          // 태그 색상 (예: '#10B981')
  category: emotionCategoryEnum("category"),        // 카테고리 ('positive', 'negative', 'neutral')
  isDefault: boolean("is_default").default(false), // 기본 제공 태그인지 여부
});
```

### 다대다 관계 테이블
하나의 일기에는 여러 개의 감정 태그가 있을 수 있고, 하나의 감정 태그는 여러 일기에 사용될 수 있습니다.

```typescript
export const diaryTags = pgTable("diary_tags", {
  id: bigint("id").primaryKey(),
  diaryId: bigint("diary_id").references(() => diaries.id),      // 일기 번호
  emotionTagId: bigint("emotion_tag_id").references(() => emotionTags.id), // 감정태그 번호
});
```

**실제 데이터 예시:**
- 일기 1번: "기쁨(1번)" + "설렘(4번)" 태그
- 일기 2번: "행복(2번)" + "감사(3번)" 태그

## 🔍 데이터 조회 (Queries) 이해하기

### getDiaries 함수 분석
```typescript
export const getDiaries = async ({ 
  profileId, 
  limit = 20, 
  searchQuery,
  emotionTagId
}: GetDiariesOptions) => {
```

이 함수는 다음과 같은 일을 합니다:

**1단계: 조건 만들기**
```typescript
const whereConditions = [
  eq(diaries.profileId, profileId),    // "특정 사용자의 일기만"
  eq(diaries.isDeleted, false)         // "삭제되지 않은 일기만"
];

if (searchQuery) {
  whereConditions.push(
    or(
      like(diaries.shortContent, `%${searchQuery}%`),  // "제목에서 검색"
      like(diaries.situation, `%${searchQuery}%`)      // "상황에서 검색"
    )
  );
}
```

**2단계: 데이터베이스에서 일기 가져오기**
```typescript
const allDiaries = await db
  .select({
    id: diaries.id,
    date: diaries.date,
    shortContent: diaries.shortContent,
    // ... 기타 필드들
  })
  .from(diaries)
  .where(and(...whereConditions))
  .limit(20);  // 최대 20개만
```

**자바 코드와 비교:**
```java
@Query("SELECT d FROM Diary d WHERE d.profileId = :profileId AND d.shortContent LIKE %:search%")
List<Diary> findByProfileIdAndSearch(String profileId, String search);
```

**3단계: 감정 태그 정보 가져오기**
```typescript
// 일기 ID들로 관련된 모든 감정 태그를 한 번에 조회
const allTags = await db
  .select({
    diaryId: diaryTags.diaryId,
    name: emotionTags.name,
    color: emotionTags.color,
  })
  .from(emotionTags)
  .innerJoin(diaryTags, eq(diaryTags.emotionTagId, emotionTags.id))
  .where(inArray(diaryTags.diaryId, diaryIds));
```

**4단계: 데이터 조합하기**
```typescript
const diariesWithTags = allDiaries.map((diary) => {
  return {
    ...diary,
    emotionTags: tagsByDiaryId[diary.id] || [], // 해당 일기의 감정태그들
    completedSteps: 5,  // 작성 완료된 항목 수
    totalSteps: 7       // 전체 항목 수
  };
});
```

## 🎨 화면 구성 (Pages & Components) 이해하기

### DiaryListPage 컴포넌트
이것이 일기 목록을 보여주는 메인 화면입니다.

**1. 데이터 가져오기 (Loader)**
```typescript
export const loader = async ({ request }) => {
  const profileId = "b0e0e902-3488-4c10-9621-fffde048923c"; // 현재 사용자 ID
  
  // 데이터베이스에서 일기 목록과 감정 태그 목록을 동시에 가져옴
  const [diaries, emotionTags] = await Promise.all([
    getDiaries({ profileId }),
    getEmotionTags(profileId)
  ]);
  
  return { diaries, emotionTags };
};
```

**2. 상태 관리 (State)**
```typescript
const [searchQuery, setSearchQuery] = useState(""); // 검색어
const [sortBy, setSortBy] = useState("date-desc");  // 정렬 방식
const [selectedDate, setSelectedDate] = useState();  // 선택된 날짜
```

**자바의 Servlet과 비교:**
```java
// 자바에서는 이렇게 처리했을 것입니다
@GetMapping("/diaries")
public String getDiaries(Model model, @RequestParam String search) {
    List<Diary> diaries = diaryService.findBySearch(search);
    model.addAttribute("diaries", diaries);
    return "diary-list"; // JSP 페이지
}
```

**3. 필터링 로직**
```typescript
const filteredEntries = useMemo(() => {
  let filtered = [...diaries];
  
  // 검색어 필터링
  if (searchQuery) {
    filtered = filtered.filter(diary => 
      diary.shortContent.includes(searchQuery)
    );
  }
  
  // 날짜 필터링
  if (selectedDate) {
    filtered = filtered.filter(diary => 
      diary.date.getTime() === selectedDate.getTime()
    );
  }
  
  return filtered;
}, [diaries, searchQuery, selectedDate]);
```

**4. 화면 렌더링**
```typescript
return (
  <div className="container">
    <h1>일기 목록</h1>
    
    {/* 필터 컴포넌트 */}
    <DiaryFilters 
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
    
    {/* 일기 카드들을 그리드로 표시 */}
    <div className="grid">
      {filteredEntries.map(entry => (
        <DiaryCard 
          key={entry.id}
          entry={entry}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  </div>
);
```

### DiaryCard 컴포넌트
개별 일기를 카드 형태로 보여주는 컴포넌트입니다.

**실제 데이터 흐름 예시:**
```typescript
// seed.sql의 첫 번째 일기 데이터가 이렇게 변환됩니다:
const entry = {
  id: 1,
  date: new Date('2025-09-15'),
  shortContent: '새로운 프로젝트를 시작한 흥미진진한 하루',
  situation: '오늘 새로운 웹 개발 프로젝트를 시작했다...',
  emotionTags: [
    { id: 1, name: '기쁨', color: '#10B981' },
    { id: 4, name: '설렘', color: '#F59E0B' }
  ],
  completedSteps: 7,  // 모든 항목이 채워짐
  totalSteps: 7
};
```

**카드에 표시되는 내용:**
```typescript
return (
  <Card>
    <CardHeader>
      {/* 날짜 표시: "9월 15일" */}
      <CardTitle>
        {date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
      </CardTitle>
    </CardHeader>
    
    <CardContent>
      {/* 감정 태그들을 색상이 있는 배지로 표시 */}
      {emotionTags.map(tag => (
        <Badge style={{ backgroundColor: tag.color }}>
          {tag.name}
        </Badge>
      ))}
      
      {/* 내용 미리보기 */}
      <p>{shortContent}</p>
      
      {/* 작성 진행도 바 */}
      <div className="progress-bar">
        <div style={{ width: `${(completedSteps/totalSteps) * 100}%` }} />
      </div>
    </CardContent>
    
    <CardFooter>
      <Button onClick={() => onView(id)}>보기</Button>
      <Button onClick={() => onEdit(id)}>수정</Button>
    </CardFooter>
  </Card>
);
```

## 🌊 실제 데이터 흐름 따라가기

### 1. 사용자가 일기 목록 페이지에 접속
```
1. 브라우저에서 /diary 경로로 요청
2. loader 함수가 실행됨
3. getDiaries() 함수로 데이터베이스 조회
   - profiles 테이블에서 사용자 확인
   - diaries 테이블에서 해당 사용자의 일기들 조회
   - diary_tags, emotion_tags 테이블 조인하여 감정태그 정보 추가
4. 조회된 데이터를 DiaryListPage 컴포넌트에 전달
```

### 2. 화면에 일기 카드들이 표시됨
```
seed.sql의 첫 번째 일기:
- ID: 1
- 날짜: 2025-09-15
- 제목: "새로운 프로젝트를 시작한 흥미진진한 하루"
- 감정태그: "기쁨"(초록색), "설렘"(주황색)
- 완료도: 7/7 단계 (100%)

→ DiaryCard 컴포넌트로 전달
→ 화면에 카드 형태로 렌더링:
  ┌─────────────────────────┐
  │ 9월 15일 (월요일)     [⋯] │
  │ [기쁨] [설렘]             │
  │ 새로운 프로젝트를 시작한... │
  │ 오늘 새로운 웹 개발...     │
  │ ████████████ 100%       │
  │ [보기] [수정]             │
  └─────────────────────────┘
```

### 3. 사용자가 검색하면
```
사용자가 "프로젝트" 검색:
1. searchQuery 상태가 "프로젝트"로 변경
2. filteredEntries가 다시 계산됨:
   - diaries.filter(d => d.shortContent.includes("프로젝트"))
3. 조건에 맞는 일기만 화면에 표시
4. URL도 ?search=프로젝트로 업데이트됨
```

### 4. 사용자가 특정 날짜를 선택하면
```
사용자가 캘린더에서 9월 15일 클릭:
1. selectedDate 상태가 변경됨
2. filteredEntries가 다시 계산됨:
   - diaries.filter(d => d.date equals 2025-09-15)
3. 해당 날짜의 일기만 화면에 표시
4. URL도 ?dateFrom=2025-09-15로 업데이트됨
```

## 🔧 중요한 개념들

### 1. 상태(State)와 props
- **상태**: 컴포넌트가 기억하고 있는 값 (검색어, 선택된 날짜 등)
- **props**: 부모 컴포넌트에서 자식 컴포넌트로 전달하는 데이터

### 2. Hook들
- **useState**: 상태를 관리하는 Hook
- **useMemo**: 계산 결과를 기억해두는 Hook (성능 최적화)
- **useCallback**: 함수를 기억해두는 Hook (성능 최적화)

### 3. 비동기 처리
- **async/await**: 데이터베이스 조회는 시간이 걸리므로 비동기로 처리
- **Promise.all**: 여러 비동기 작업을 동시에 실행

### 4. 타입스크립트의 장점
```typescript
interface DiaryEntry {
  id: number;
  date: Date;
  shortContent: string | null;  // null일 수도 있음을 명시
}

// 컴파일 시점에 타입 검사로 오류를 미리 발견
const entry: DiaryEntry = {
  id: "1",  // ❌ 오류: number가 아닌 string
  date: "2025-09-15",  // ❌ 오류: Date가 아닌 string
};
```

## 💡 추가로 알아두면 좋은 것들

### 1. 컴포넌트 재사용성
DiaryCard 컴포넌트는 다른 곳에서도 재사용할 수 있습니다:
```typescript
// 홈페이지에서 최근 일기 3개만 보여주기
<div className="recent-diaries">
  {recentDiaries.slice(0, 3).map(entry => (
    <DiaryCard key={entry.id} entry={entry} onEdit={handleEdit} />
  ))}
</div>
```

### 2. 성능 최적화
- **useMemo**: 비싼 계산은 한 번만 하고 결과를 캐시
- **useCallback**: 함수를 캐시해서 불필요한 리렌더링 방지
- **React.memo**: 컴포넌트를 캐시해서 props가 같으면 리렌더링 안 함

### 3. 에러 처리
실제 프로덕션 코드에서는 에러 처리가 중요합니다:
```typescript
try {
  const diaries = await getDiaries({ profileId });
} catch (error) {
  console.error("일기 조회 실패:", error);
  // 사용자에게 에러 메시지 표시
}
```

이렇게 실제 데이터가 어떻게 흘러가고, 화면에 어떻게 표시되는지 이해하셨나요? 궁금한 부분이 있으면 언제든 질문해주세요!