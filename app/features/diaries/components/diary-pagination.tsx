import { Button } from "~/common/components/ui/button";

type DiaryPaginationProps = {
  currentPage: number;
  canGoToPrevious: boolean;
  canGoToNext: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function DiaryPagination({
  currentPage,
  canGoToPrevious,
  canGoToNext,
  onPreviousPage,
  onNextPage,
}: DiaryPaginationProps) {
  if (!canGoToPrevious && !canGoToNext) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      {canGoToPrevious && (
        <Button variant="outline" onClick={onPreviousPage}>
          이전 페이지
        </Button>
      )}

      <span className="text-sm text-muted-foreground">
        페이지 {currentPage}
      </span>

      {canGoToNext && (
        <Button variant="outline" onClick={onNextPage}>
          다음 페이지
        </Button>
      )}
    </div>
  );
}