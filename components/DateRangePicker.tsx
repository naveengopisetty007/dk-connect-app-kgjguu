
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;
const isWeb = Platform.OS === 'web';

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

  const currentMonthDays = useMemo(() => {
    return generateCalendarDays(currentMonth);
  }, [currentMonth]);

  const nextMonthDays = useMemo(() => {
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

  const formatDateRange = () => {
    if (!tempStartDate || !tempEndDate) return 'Select dates';
    
    const formatDate = (date: Date) => {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };

    return `${formatDate(tempStartDate)} - ${formatDate(tempEndDate)}`;
  };

  const renderCalendar = (days: (Date | null)[], monthOffset: number = 0) => {
    const displayMonth = new Date(currentMonth);
    displayMonth.setMonth(displayMonth.getMonth() + monthOffset);

    return (
      <View style={styles.calendar}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            style={styles.monthNavButton}
            onPress={handlePreviousMonth}
            disabled={monthOffset !== 0}
          >
            {monthOffset === 0 && (
              <IconSymbol
                ios_icon_name="chevron.left"
                android_material_icon_name="chevron_left"
                size={24}
                color={colors.text}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {MONTHS[displayMonth.getMonth()]} {displayMonth.getFullYear()}
          </Text>
          <TouchableOpacity
            style={styles.monthNavButton}
            onPress={handleNextMonth}
            disabled={monthOffset === 0}
          >
            {monthOffset === 1 && (
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={24}
                color={colors.text}
              />
            )}
          </TouchableOpacity>
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
            const isToday = date && isSameDay(date, new Date());

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !date && styles.dayCellEmpty,
                  inRange && styles.dayCellInRange,
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

  const shouldShowHorizontal = isWeb && SCREEN_WIDTH >= 1024;

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
          <View style={[
            styles.modalContent,
            shouldShowHorizontal && styles.modalContentHorizontal,
          ]}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Date Range</Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <IconSymbol
                  ios_icon_name="xmark"
                  android_material_icon_name="close"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.selectedDateContainer}>
              <IconSymbol
                ios_icon_name="calendar"
                android_material_icon_name="calendar_today"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.selectedDateText}>{formatDateRange()}</Text>
            </View>

            <ScrollView
              style={styles.calendarsScrollView}
              contentContainerStyle={[
                styles.calendarsContainer,
                shouldShowHorizontal && styles.calendarsContainerHorizontal,
              ]}
              showsVerticalScrollIndicator={false}
            >
              {renderCalendar(currentMonthDays, 0)}
              {renderCalendar(nextMonthDays, 1)}
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
    padding: isWeb ? 20 : 16,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: '100%',
    maxWidth: isTablet ? 500 : 380,
    maxHeight: '90%',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  modalContentHorizontal: {
    maxWidth: 720,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  calendarsScrollView: {
    maxHeight: 600,
  },
  calendarsContainer: {
    padding: 16,
  },
  calendarsContainerHorizontal: {
    flexDirection: 'row',
    gap: 20,
  },
  calendar: {
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  monthNavButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 18,
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
    fontSize: 13,
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
  dayContent: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContentToday: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayContentSelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});
