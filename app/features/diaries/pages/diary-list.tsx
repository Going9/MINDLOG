// src/app/features/diaries/pages/diary-list.tsx

/**
 * ## 페이지 흐름 및 역할
 *
 * 이 파일은 사용자의 모든 일기 항목을 목록 형태로 보여주는 메인 페이지 컴포넌트입니다.
 * 사용자는 이 페이지에서 다음을 할 수 있습니다:
 * 1. 캘린더를 통해 특정 날짜의 일기를 확인합니다.
 * 2. 검색, 정렬, 감정, 작성 상태 등 다양한 필터를 적용하여 일기를 탐색합니다.
 * 3. 각 일기 카드를 통해 요약 내용을 확인하고, 수정/삭제/상세보기 등의 작업을 수행합니다.
 * 4. '새 일기 쓰기' 버튼을 통해 새로운 일기를 작성하는 페이지로 이동합니다.
 *
 * ## 코드 구조 및 원리
 *
 * - 'DiaryListPage' 컴포넌트가 이 페이지의 핵심입니다.
 * - 'useState' Hook을 사용하여 검색어, 정렬 순서, 필터링 옵션, 선택된 날짜 등 사용자의 인터랙션에 따른 상태를 관리합니다.
 * - 'useMemo' Hook을 사용하여 필터링 및 정렬된 일기 목록을 계산합니다. 이 Hook은 필터링 조건이 변경될 때만 다시 계산을 수행하여 성능을 최적화합니다.
 * - 페이지 레이아웃은 CSS Grid를 사용하여 캘린더(사이드바)와 일기 목록(메인 콘텐츠)으로 나뉩니다.
 * - 'DiaryFilters', 'DiaryCalendar', 'DiaryCard', 'EmptyState' 등 여러 하위 컴포넌트를 조합하여 UI를 구성합니다. 각 컴포넌트는 특정 기능(필터링 UI, 캘린더 UI 등)에 대한 책임을 가집니다.
 * - 현재는 'mockDiaryEntries'라는 임시 데이터를 사용하고 있지만, 실제 애플리케이션에서는 'loader' 함수나 'useEffect' Hook을 사용하여 서버로부터 데이터를 비동기적으로 가져와야 합니다.
 */

import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";
import { Button } from "~/common/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DiaryCard } from "../components/diary-card";
import { DiaryCalendar } from "../components/diary-calendar";
import { EmptyState } from "../components/empty-state";
import { DiaryFilters } from "../components/diary-filters";

// Mock data - replace with actual data fetching
const mockEmotionTags = [
  {
    id: 1,
    name: "기쁨",
    color: "#10B981",
    category: "positive" as const,
    isDefault: true,
  },
  {
    id: 2,
    name: "행복",
    color: "#3B82F6",
    category: "positive" as const,
    isDefault: true,
  },
  {
    id: 3,
    name: "감사",
    color: "#8B5CF6",
    category: "positive" as const,
    isDefault: true,
  },
  {
    id: 4,
    name: "설렘",
    color: "#F59E0B",
    category: "positive" as const,
    isDefault: true,
  },
  {
    id: 5,
    name: "슬픔",
    color: "#6B7280",
    category: "negative" as const,
    isDefault: true,
  },
  {
    id: 6,
    name: "분노",
    color: "#EF4444",
    category: "negative" as const,
    isDefault: true,
  },
  {
    id: 7,
    name: "불안",
    color: "#F97316",
    category: "negative" as const,
    isDefault: true,
  },
  {
    id: 8,
    name: "걱정",
    color: "#84CC16",
    category: "negative" as const,
    isDefault: true,
  },
  {
    id: 9,
    name: "평온",
    color: "#06B6D4",
    category: "neutral" as const,
    isDefault: true,
  },
  {
    id: 10,
    name: "무관심",
    color: "#64748B",
    category: "neutral" as const,
    isDefault: true,
  },
];

const mockDiaryEntries = [
  {
    id: "1",
    date: new Date(2024, 11, 15),
    shortContent: "새로운 프로젝트를 시작한 흥미진진한 하루",
    situation:
      "오늘 새로운 웹 개발 프로젝트를 시작했다. 처음에는 막막했지만 점점 재미있어지고 있다.",
    reaction: "처음엔 걱정이 많았지만 차근차근 해나가니 할 수 있을 것 같다.",
    emotionTags: [mockEmotionTags[0], mockEmotionTags[3], mockEmotionTags[8]],
    completedSteps: 5,
    totalSteps: 5,
  },
  {
    id: "2",
    date: new Date(2024, 11, 14),
    shortContent: "친구와의 오랜만의 만남",
    situation: "대학 친구와 2년만에 만났다.",
    reaction: "정말 반가웠고 옛 추억이 많이 생각났다.",
    emotionTags: [mockEmotionTags[1], mockEmotionTags[2]],
    completedSteps: 3,
    totalSteps: 5,
  },
  {
    id: "3",
    date: new Date(2024, 11, 13),
    shortContent: "힘들었던 하루지만 배운 게 많았다",
    situation: "업무가 많아서 스트레스를 많이 받았다.",
    reaction: "힘들었지만 새로운 것을 배울 수 있어서 의미있었다.",
    emotionTags: [mockEmotionTags[4], mockEmotionTags[6], mockEmotionTags[2]],
    completedSteps: 4,
    totalSteps: 5,
  },
  {
    id: "4",
    date: new Date(2024, 11, 12),
    shortContent: "가족과 함께한 따뜻한 저녁",
    situation: "오랜만에 가족 모두가 함께 저녁을 먹었다.",
    reaction: "평범하지만 소중한 시간이었다.",
    emotionTags: [mockEmotionTags[2], mockEmotionTags[8]],
    completedSteps: 5,
    totalSteps: 5,
  },
  {
    id: "5",
    date: new Date(2024, 11, 11),
    shortContent: "운동을 시작한 첫날",
    situation: "헬스장에 등록하고 첫 운동을 했다.",
    reaction: "몸은 힘들었지만 기분이 좋았다.",
    emotionTags: [mockEmotionTags[0], mockEmotionTags[3]],
    completedSteps: 2,
    totalSteps: 5,
  },
];

function DiaryListPage() {
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedEmotionFilter, setSelectedEmotionFilter] = useState<
    (typeof mockEmotionTags)[0] | undefined
  >();
  const [completionFilter, setCompletionFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Get unique emotions from all entries
  const availableEmotions = useMemo(() => {
    const emotionIds = new Set<number>();
    mockDiaryEntries.forEach(entry => {
      entry.emotionTags.forEach(tag => emotionIds.add(tag.id));
    });
    return mockEmotionTags.filter(emotion => emotionIds.has(emotion.id));
  }, []);

  // Filter and sort entries
  const filteredAndSortedEntries = useMemo(() => {
    let filtered = [...mockDiaryEntries];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        entry =>
          entry.shortContent?.toLowerCase().includes(query) ||
          entry.situation?.toLowerCase().includes(query) ||
          entry.reaction?.toLowerCase().includes(query)
      );
    }

    // Apply emotion filter
    if (selectedEmotionFilter) {
      filtered = filtered.filter(entry =>
        entry.emotionTags.some(tag => tag.id === selectedEmotionFilter.id)
      );
    }

    // Apply completion filter
    if (completionFilter === "complete") {
      filtered = filtered.filter(
        entry => entry.completedSteps === entry.totalSteps
      );
    } else if (completionFilter === "incomplete") {
      filtered = filtered.filter(
        entry => entry.completedSteps < entry.totalSteps
      );
    }

    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter(
        entry => entry.date.toDateString() === selectedDate.toDateString()
      );
    }

    // Sort entries
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return a.date.getTime() - b.date.getTime();
        case "date-desc":
          return b.date.getTime() - a.date.getTime();
        case "completion-asc":
          return (
            a.completedSteps / a.totalSteps - b.completedSteps / b.totalSteps
          );
        case "completion-desc":
          return (
            b.completedSteps / b.totalSteps - a.completedSteps / a.totalSteps
          );
        default:
          return b.date.getTime() - a.date.getTime();
      }
    });

    return filtered;
  }, [
    mockDiaryEntries,
    searchQuery,
    selectedEmotionFilter,
    completionFilter,
    selectedDate,
    sortBy,
  ]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("date-desc");
    setSelectedEmotionFilter(undefined);
    setCompletionFilter("all");
    setSelectedDate(undefined);
  };

  // Entry actions
  const handleEdit = (id: string) => {
    console.log("Edit entry:", id);
    // Navigate to edit page
  };

  const handleDelete = (id: string) => {
    console.log("Delete entry:", id);
    // Show confirmation and delete
  };

  const handleView = (id: string) => {
    console.log("View entry:", id);
    // Navigate to view page
  };

  return (
    <div className='container mx-auto max-w-7xl px-4 py-8'>
      {/* Breadcrumb */}
      <Breadcrumb className='mb-6'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to='/'>홈</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>일기 목록</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>일기 목록</h1>
          <p className='text-muted-foreground mt-2'>
            {mockDiaryEntries.length}개의 일기가 있습니다
          </p>
        </div>
        {/* Desktop New Diary Button */}
        <Button asChild size='lg' className='hidden sm:flex'>
          <Link to='/diary/new'>
            <PlusIcon className='w-4 h-4 mr-2' />새 일기 쓰기
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        {/* Calendar Sidebar */}
        <div className='lg:col-span-1'>
          <div className='sticky top-8 space-y-4'>
            <DiaryCalendar
              entries={mockDiaryEntries}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            {/* Mobile New Diary Button */}
            <Button asChild size='lg' className='w-full sm:hidden'>
              <Link to='/diary/new'>
                <PlusIcon className='w-4 h-4 mr-2' />새 일기 쓰기
              </Link>
            </Button>
          </div>
        </div>

        {/* Entries Section */}
        <div className='lg:col-span-3 space-y-6'>
          {/* Filters */}
          <DiaryFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedEmotionFilter={selectedEmotionFilter}
            onEmotionFilterChange={setSelectedEmotionFilter}
            completionFilter={completionFilter}
            onCompletionFilterChange={setCompletionFilter}
            availableEmotions={availableEmotions}
            onClearFilters={clearFilters}
            totalEntries={mockDiaryEntries.length}
            filteredEntries={filteredAndSortedEntries.length}
          />

          {/* Entries Grid */}
          {filteredAndSortedEntries.length === 0 ? (
            <EmptyState
              type={
                selectedDate
                  ? "date-no-entries"
                  : mockDiaryEntries.length === 0
                    ? "no-entries"
                    : "no-results"
              }
              selectedDate={selectedDate}
              onClearFilters={clearFilters}
            />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {filteredAndSortedEntries.map(entry => (
                <DiaryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Default export for React Router v7
export default DiaryListPage;

// Optional: Add a loader if needed for data fetching
export function loader() {
  return {
    entries: [], // Replace with actual data fetching
  };
}
