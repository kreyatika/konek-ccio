
import React, { createContext, useContext } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getDay, getDaysInMonth, isSameDay } from 'date-fns';
import { useCalendarStore } from '@/hooks/useCalendarStore';
import CalendarCombobox from './CalendarCombobox';
import { monthsForLocale, daysForLocale } from '@/lib/calendar-utils';
import type { CalendarItem } from '@/types';

type CalendarContextProps = {
  locale: Intl.LocalesArgument;
  startDay: number;
};

const CalendarContext = createContext<CalendarContextProps>({
  locale: 'en-US',
  startDay: 0,
});

interface CalendarViewProps {
  date: Date;
  setDate: (date: Date) => void;
  calendarItems: CalendarItem[];
}

type OutOfBoundsDayProps = {
  day: number;
};

const OutOfBoundsDay = ({ day }: OutOfBoundsDayProps) => (
  <div className="relative h-full w-full bg-secondary p-1 text-muted-foreground text-xs">
    {day}
  </div>
);

const CalendarView = ({ date, setDate, calendarItems }: CalendarViewProps) => {
  const { month, year, setMonth, setYear } = useCalendarStore();
  const locale = 'en-US';
  const startDay = 0;

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth((month - 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11);
    }
    const newDate = new Date(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, 1);
    setDate(newDate);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth((month + 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11);
    }
    const newDate = new Date(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, 1);
    setDate(newDate);
  };

  const handleMonthChange = (monthValue: string) => {
    const newMonth = Number.parseInt(monthValue) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
    setMonth(newMonth);
    const newDate = new Date(year, newMonth, 1);
    setDate(newDate);
  };

  const handleYearChange = (yearValue: string) => {
    const newYear = Number.parseInt(yearValue);
    setYear(newYear);
    const newDate = new Date(newYear, month, 1);
    setDate(newDate);
  };

  // Calendar body calculations
  const daysInMonth = getDaysInMonth(new Date(year, month, 1));
  const firstDay = (getDay(new Date(year, month, 1)) - startDay + 7) % 7;
  
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1));
  
  const days = [];

  // Previous month days
  for (let i = 0; i < firstDay; i++) {
    const day = prevMonthDays - firstDay + i + 1;
    days.push(<OutOfBoundsDay key={`prev-${i}`} day={day} />);
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const itemsForDay = calendarItems.filter(item => 
      isSameDay(new Date(item.start), currentDate)
    );

    days.push(
      <div
        key={`current-${day}`}
        className="relative flex h-full w-full flex-col gap-1 p-1 text-muted-foreground text-xs"
        onClick={() => setDate(new Date(year, month, day))}
      >
        <div className={cn(
          'text-xs font-medium', 
          isSameDay(currentDate, new Date()) && 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center',
          isSameDay(currentDate, date) && !isSameDay(currentDate, new Date()) && 'bg-secondary rounded-full w-6 h-6 flex items-center justify-center'
        )}>
          {day}
        </div>
        <div>
          {itemsForDay.slice(0, 3).map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-1 text-xs mb-1"
              style={{ color: item.color }}
            >
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.title}</span>
            </div>
          ))}
        </div>
        {itemsForDay.length > 3 && (
          <span className="block text-muted-foreground text-xs">
            +{itemsForDay.length - 3} more
          </span>
        )}
      </div>
    );
  }

  // Next month days
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  const remainingDays = 7 - ((firstDay + daysInMonth) % 7);
  
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      days.push(<OutOfBoundsDay key={`next-${i}`} day={i + 1} />);
    }
  }

  // Create data for month and year pickers
  const monthOptions = monthsForLocale(locale).map((monthName, index) => ({
    value: index.toString(),
    label: monthName,
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => ({
    value: (currentYear - 5 + i).toString(),
    label: (currentYear - 5 + i).toString(),
  }));

  return (
    <div className="bg-card rounded-lg shadow">
      <CalendarContext.Provider value={{ locale, startDay }}>
        <div className="relative flex flex-col">
          {/* Calendar Header with Date Controls */}
          <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center gap-4">
              <CalendarCombobox
                value={month.toString()}
                setValue={handleMonthChange}
                data={monthOptions}
                labels={{
                  button: 'Select month',
                  empty: 'No month found',
                  search: 'Search month',
                }}
              />
              <CalendarCombobox
                value={year.toString()}
                setValue={handleYearChange}
                data={yearOptions}
                labels={{
                  button: 'Select year',
                  empty: 'No year found',
                  search: 'Search year',
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handlePreviousMonth} variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => {
                  const today = new Date();
                  setDate(today);
                  setMonth(today.getMonth() as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11);
                  setYear(today.getFullYear());
                }}
                variant="outline"
              >
                Today
              </Button>
              <Button onClick={handleNextMonth} variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Days Header */}
          <div className="grid grid-cols-7">
            {daysForLocale(locale, startDay).map((day) => (
              <div key={day} className="p-3 text-center text-muted-foreground text-xs font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="grid grid-cols-7 border-t">
            {days.map((day, index) => (
              <div
                key={index}
                className={cn(
                  'relative aspect-square overflow-hidden border-r border-b',
                  index % 7 === 6 && 'border-r-0'
                )}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </CalendarContext.Provider>
    </div>
  );
};

export default CalendarView;
