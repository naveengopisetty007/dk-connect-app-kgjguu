
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface DateRangePickerProps {
  visible: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function DateRangePicker({
  visible,
  onClose,
  startDate,
  endDate,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const year = date.getFullYear();
    const month = date.getMonth();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const leftMonthDays = useMemo(() => {
    return generateCalendarDays(currentMonth);
  }, [currentMonth]);

  const rightMonthDays = useMemo(() => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return generateCalendarDays(nextMonth);
  }, [currentMonth]);

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isInRange = (date: Date | null) => {
    if (!date || !tempStartDate || !tempEndDate) return false;
    const time = date.getTime();
    return time > tempStartDate.getTime() && time < tempEndDate.getTime();
  };

  const isStartDate = (date: Date | null) => {
    return isSameDay(date, tempStartDate);
  };

  const isEndDate = (date: Date | null) => {
    return isSameDay(date, tempEndDate);
  };

  const handleDatePress = (date: Date) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      // Start new selection
      setTempStartDate(date);
      setTempEndDate(null);
    } else {
      // Complete the range
      if (date < tempStartDate) {
        setTempStartDate(date);
        setTempEndDate(tempStartDate);
      } else {
        setTempEndDate(date);
      }
    }
  };

  const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const handleApply = () => {
    onDateRangeChange(tempStartDate, tempEndDate);
    onClose();
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    onClose();
  };

  const renderCalendar = (days: (Date | null)[], monthOffset: number = 0) => {
    const displayMonth = new Date(currentMonth);
    displayMonth.setMonth(displayMonth.getMonth() + monthOffset);

    return (
      <View style={styles.calendar}>
        <View style={styles.calendarHeader}>
          {monthOffset === 0 && (
            <TouchableOpacity
              style={styles.monthNavButton}
              onPress={handlePreviousMonth}
            >
              <IconSymbol
                ios_icon_name="chevron.left"
                android_material_icon_name="chevron_left"
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.monthTitle}>
            {MONTHS[displayMonth.getMonth()]} {displayMonth.getFullYear()}
          </Text>
          {monthOffset === 1 && (
            <TouchableOpacity
              style={styles.monthNavButton}
              onPress={handleNextMonth}
            >
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.daysOfWeekContainer}>
          {DAYS_OF_WEEK.map((day, index) => (
            <View key={index} style={styles.dayOfWeekCell}>
              <Text style={styles.dayOfWeekText}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.daysContainer}>
          {days.map((date, index) => {
            const isStart = isStartDate(date);
            const isEnd = isEndDate(date);
            const inRange = isInRange(date);
            const isToday =
              date && isSameDay(date, new Date());

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !date && styles.dayCellEmpty,
                  inRange && styles.dayCellInRange,
                  (isStart || isEnd) && styles.dayCellSelected,
                  isStart && styles.dayCellStart,
                  isEnd && styles.dayCellEnd,
                ]}
                onPress={() => date && handleDatePress(date)}
                disabled={!date}
              >
                {date && (
                  <View
                    style={[
                      styles.dayContent,
                      isToday && styles.dayContentToday,
                      (isStart || isEnd) && styles.dayContentSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        !date && styles.dayTextEmpty,
                        (isStart || isEnd) && styles.dayTextSelected,
                        isToday && !isStart && !isEnd && styles.dayTextToday,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleCancel}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <IconSymbol
                  ios_icon_name="calendar"
                  android_material_icon_name="calendar_today"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.headerTitle}>Pick a date range</Text>
              </View>
              <TouchableOpacity onPress={handleCancel}>
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.calendarsContainer}
            >
              {renderCalendar(leftMonthDays, 0)}
              {Platform.OS === 'web' && (
                <View style={styles.calendarSeparator} />
              )}
              {renderCalendar(rightMonthDays, 1)}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.applyButton,
                  (!tempStartDate || !tempEndDate) && styles.applyButtonDisabled,
                ]}
                onPress={handleApply}
                disabled={!tempStartDate || !tempEndDate}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: Platform.OS === 'web' ? 'auto' : '100%',
    maxWidth: Platform.OS === 'web' ? 720 : 400,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  calendarsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: Platform.OS === 'web' ? 20 : 0,
  },
  calendarSeparator: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
  calendar: {
    width: Platform.OS === 'web' ? 320 : '100%',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  monthNavButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayOfWeekCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayOfWeekText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayCellEmpty: {
    backgroundColor: 'transparent',
  },
  dayCellInRange: {
    backgroundColor: '#E3F2FD',
  },
  dayCellSelected: {
    backgroundColor: 'transparent',
  },
  dayCellStart: {
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  dayCellEnd: {
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  dayContent: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContentToday: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dayContentSelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  dayTextEmpty: {
    color: colors.textSecondary,
  },
  dayTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  dayTextToday: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});
