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
 * - 'loader' 함수를 통해 서버 데이터베이스로부터 일기와 감정 태그 데이터를 비동기적으로 가져옵니다.
 * - 완성도(completion) 계산은 일기의 7개 핵심 필드(shortContent, situation, reaction, physicalSensation, desiredReaction, gratitudeMoment, selfKindWords)를 기반으로 합니다.
 */

import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
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
import { getDiaries } from "../queries";
import { getEmotionTags } from "../../emotions/queries";
import type { Route } from "./+types/diary-list";

// Loader for data fetching with URL search params support
export const loader = async ({ request }: { request: Request }) => {
  // TODO: 실제 인증 시스템 구현시 세션에서 profileId 가져오기
  // 현재는 하드코딩된 프로필 ID 사용 (Supabase에 등록된 프로필)
  const profileId = "b0e0e902-3488-4c10-9621-fffde048923c";

  // Parse URL search params for server-side filtering
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("search") || undefined;
  const sortBy = (url.searchParams.get("sortBy") as any) || "date-desc";
  const emotionTagId = url.searchParams.get("emotionTagId")
    ? parseInt(url.searchParams.get("emotionTagId")!)
    : undefined;
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  // Date filters
  const dateFrom = url.searchParams.get("dateFrom")
    ? new Date(url.searchParams.get("dateFrom")!)
    : undefined;
  const dateTo = url.searchParams.get("dateTo")
    ? new Date(url.searchParams.get("dateTo")!)
    : undefined;

  const [diaries, emotionTags] = await Promise.all([
    getDiaries({
      profileId,
      searchQuery,
      sortBy,
      emotionTagId,
      dateFrom,
      dateTo,
      limit,
      offset,
    }),
    getEmotionTags(profileId),
  ]);

  return {
    diaries,
    emotionTags,
    pagination: {
      currentPage: page,
      limit,
      hasNextPage: diaries.length === limit,
    },
    filters: {
      searchQuery,
      sortBy,
      emotionTagId,
      dateFrom: dateFrom?.toISOString(),
      dateTo: dateTo?.toISOString(),
    },
  };
};

export default function DiaryListPage({ loaderData }: Route.ComponentProps) {
  const { diaries, emotionTags, pagination, filters } = loaderData;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  type EmotionTagType = {
    id: number;
    name: string;
    color: string | null;
    category: "positive" | "negative" | "neutral" | null;
    isDefault: boolean | null;
    usageCount?: number | null;
  };

  // Initialize states from URL params or filters
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || "");
  const [sortBy, setSortBy] = useState(filters.sortBy || "date-desc");
  const [selectedEmotionFilter, setSelectedEmotionFilter] = useState<
    EmotionTagType | undefined
  >(
    filters.emotionTagId
      ? emotionTags.find(tag => tag.id === filters.emotionTagId)
      : undefined
  );
  const [completionFilter, setCompletionFilter] = useState("all"); // Keep client-side for completion filtering
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    filters.dateFrom ? new Date(filters.dateFrom) : undefined
  );

  // Get available emotions (all emotions since filtering is now server-side)
  const availableEmotions = useMemo(() => {
    return emotionTags as EmotionTagType[];
  }, [emotionTags]);

  // Apply only client-side completion filter (server doesn't handle this yet)
  const filteredAndSortedEntries = useMemo(() => {
    let filtered = [...diaries];

    // Apply completion filter (only client-side filter remaining)
    if (completionFilter === "complete") {
      filtered = filtered.filter(
        entry => (entry as any).completedSteps === (entry as any).totalSteps
      );
    } else if (completionFilter === "incomplete") {
      filtered = filtered.filter(
        entry => (entry as any).completedSteps < (entry as any).totalSteps
      );
    }

    return filtered;
  }, [diaries, completionFilter]);

  // URL navigation helper
  const updateUrlParams = useCallback(
    (newParams: Record<string, string | undefined>) => {
      const url = new URL(window.location.href);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        } else {
          url.searchParams.delete(key);
        }
      });

      // Reset to page 1 when filters change
      if (Object.keys(newParams).some(key => key !== "page")) {
        url.searchParams.set("page", "1");
      }

      navigate(url.pathname + url.search, { replace: true });
    },
    [navigate]
  );

  // Filter handlers
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    updateUrlParams({ search: query || undefined });
  }, [updateUrlParams]);

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
    updateUrlParams({ sortBy: sort });
  }, [updateUrlParams]);

  const handleEmotionFilterChange = useCallback((emotion?: EmotionTagType) => {
    setSelectedEmotionFilter(emotion);
    updateUrlParams({ emotionTagId: emotion?.id.toString() });
  }, [updateUrlParams]);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    updateUrlParams({ 
      dateFrom: date?.toISOString().split('T')[0],
      dateTo: date?.toISOString().split('T')[0] 
    });
  }, [updateUrlParams]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSortBy("date-desc");
    setSelectedEmotionFilter(undefined);
    setCompletionFilter("all");
    setSelectedDate(undefined);
    
    navigate(window.location.pathname, { replace: true });
  }, [navigate]);

  // Entry actions
  const handleEdit = (id: number) => {
    console.log("Edit entry:", id);
    // Navigate to edit page
  };

  const handleDelete = (id: number) => {
    console.log("Delete entry:", id);
    // Show confirmation and delete
  };

  const handleView = (id: number) => {
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
            {diaries.length}개의 일기가 있습니다
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
              entries={diaries.map(d => ({ ...d, date: new Date(d.date) }))}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
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
            onSearchChange={handleSearchChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            selectedEmotionFilter={selectedEmotionFilter}
            onEmotionFilterChange={handleEmotionFilterChange}
            completionFilter={completionFilter}
            onCompletionFilterChange={setCompletionFilter}
            availableEmotions={availableEmotions}
            onClearFilters={clearFilters}
            totalEntries={diaries.length}
            filteredEntries={filteredAndSortedEntries.length}
          />

          {/* Entries Grid */}
          {filteredAndSortedEntries.length === 0 ? (
            <EmptyState
              type={
                selectedDate
                  ? "date-no-entries"
                  : diaries.length === 0
                    ? "no-entries"
                    : "no-results"
              }
              selectedDate={selectedDate}
              onClearFilters={clearFilters}
            />
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {filteredAndSortedEntries.map(entry => (
                  <DiaryCard
                    key={entry.id}
                    entry={{ ...entry, date: new Date(entry.date) }}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>

              {/* Pagination */}
              {diaries.length === pagination.limit && (
                <div className='flex justify-center items-center gap-4 mt-8'>
                  {pagination.currentPage > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => updateUrlParams({ 
                        page: (pagination.currentPage - 1).toString() 
                      })}
                    >
                      이전 페이지
                    </Button>
                  )}
                  
                  <span className='text-sm text-muted-foreground'>
                    페이지 {pagination.currentPage}
                  </span>
                  
                  {pagination.hasNextPage && (
                    <Button
                      variant="outline"
                      onClick={() => updateUrlParams({ 
                        page: (pagination.currentPage + 1).toString() 
                      })}
                    >
                      다음 페이지
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
