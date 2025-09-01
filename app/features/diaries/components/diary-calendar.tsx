import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/common/components/ui/badge";
import { Calendar } from "~/common/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { cn } from "~/lib/utils";

interface EmotionTag {
  id: number;
  name: string;
  color: string;
  category: "positive" | "negative" | "neutral";
  isDefault: boolean;
}

interface DiaryEntry {
  id: string;
  date: Date;
  emotionTags: EmotionTag[];
  completedSteps: number;
  totalSteps: number;
}

interface DiaryCalendarProps {
  entries: DiaryEntry[];
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export function DiaryCalendar({
  entries,
  selectedDate,
  onDateSelect,
}: DiaryCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Create a map of dates to diary entries for quick lookup
  const entriesByDate = entries.reduce(
    (acc, entry) => {
      const dateKey = entry.date.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(entry);
      return acc;
    },
    {} as Record<string, DiaryEntry[]>
  );

  // Check if a date has entries
  const hasEntry = (date: Date) => {
    return entriesByDate[date.toDateString()]?.length > 0;
  };

  // Get entries for a specific date
  const getEntriesForDate = (date: Date) => {
    return entriesByDate[date.toDateString()] || [];
  };

  return (
    <Card className='w-full'>
      <CardContent className='flex flex-col items-center'>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={onDateSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          // 👇 className에서 w-full을 제거하고, 날짜 칸 크기만 지정합니다.
          className='[&_.rdp-day]:w-9 [&_.rdp-day]:h-9'
          modifiers={{
            hasEntry: date => hasEntry(date),
          }}
          modifiersStyles={{
            hasEntry: {
              fontWeight: "bold",
            },
          }}
          // 👇 selected 상태에도 동일한 크기를 지정해줍니다.
          modifiersClassNames={{
            hasEntry:
              "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full",
            selected:
              "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary rounded-full",
          }}
        />
        {/* Selected Date Info */}
        {selectedDate && (
          <div className='mt-4 p-3 bg-muted/50 rounded-lg w-full'>
            <div className='flex items-center justify-center mb-2'>
              <h4 className='font-medium text-sm'>
                {selectedDate.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </h4>
            </div>

            {(() => {
              const dayEntries = getEntriesForDate(selectedDate);
              if (dayEntries.length === 0) {
                return (
                  <p className='text-xs text-muted-foreground text-center'>
                    이 날에 작성된 일기가 없습니다.
                  </p>
                );
              }

              return (
                <div className='space-y-2'>
                  <p className='text-xs text-muted-foreground text-center'>
                    {dayEntries.length}개의 일기
                  </p>
                  <div className='flex flex-wrap justify-center gap-1'>
                    {dayEntries.map(entry =>
                      entry.emotionTags.slice(0, 3).map(tag => (
                        <Badge
                          key={`${entry.id}-${tag.id}`}
                          style={{ backgroundColor: tag.color }}
                          className='text-white text-xs h-5 px-2'
                        >
                          {tag.name}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
