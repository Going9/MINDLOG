import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DiaryCalendar } from "./diary-calendar";

type DiarySidebarProps = {
  calendarDates: string[]; // 날짜 문자열 배열
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
};

export function DiarySidebar({
  calendarDates,
  selectedDate,
  onDateSelect,
}: DiarySidebarProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-8 space-y-4">
        <DiaryCalendar
          diaryDates={calendarDates}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
        {/* Mobile New Diary Button */}
        <Button asChild size="lg" className="w-full sm:hidden">
          <Link to="/diary/new">
            <PlusIcon className="w-4 h-4 mr-2" />
            새 일기 쓰기
          </Link>
        </Button>
      </div>
    </div>
  );
}