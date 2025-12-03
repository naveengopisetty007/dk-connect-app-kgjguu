
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import Dropdown, { DropdownOption } from '@/components/Dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DealSubmission {
  id: string;
  customer: string;
  dateRange: string;
  dealType: string;
  submission: string;
  location: string;
  product: string;
  status: string;
}

export default function DealSubmissionScreen() {
  const [dealStatus, setDealStatus] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>('start');

  // Sample data for the table
  const [dealSubmissions] = useState<DealSubmission[]>([
    {
      id: '1',
      customer: 'Mccraw Oil Company, Inc',
      dateRange: '12/02/2024 - 12/02/2025',
      dealType: '3%(OXL UB RACK POSTING - 87 CONV E10 ABILENE, TX - OKL + 3) +1',
      submission: 'Surya sudhakar Gogada - 12/02/2025',
      location: '86 Conv E10',
      product: '86 Conv E10',
      status: 'Awaiting approval',
    },
    {
      id: '2',
      customer: 'Ben Mitchell Enterprises',
      dateRange: '12/02/2024 - 12/02/2025',
      dealType: '(4%(PLATTS CBOB REG @ USGC PIPELINE + 4) + 33%(OPIS ETHANOL E100 @ CHICAGO, IL + 33) + 22%(RINS WHOLESALE + 3) +1)',
      submission: 'Surya sudhakar Gogada - 12/02/2025',
      location: '87 Conv E10',
      product: '87 Conv E10',
      status: 'Awaiting approval',
    },
    {
      id: '3',
      customer: 'Ben Mitchell Enterprises',
      dateRange: '12/02/2024 - 12/02/2025',
      dealType: '3%(OXL UB RACK POSTING - 87 CONV E10 ABILENE, TX - OKL + 2) +1',
      submission: 'Surya sudhakar Gogada - 12/02/2025',
      location: '86 Conv E10',
      product: '86 Conv E10',
      status: 'Awaiting approval',
    },
  ]);

  const dealStatusOptions: DropdownOption[] = [
    { label: 'Awaiting Approval', value: 'awaiting_approval' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'In Review', value: 'in_review' },
    { label: 'Pending', value: 'pending' },
  ];

  const customerOptions: DropdownOption[] = [
    { label: 'Mccraw Oil Company, Inc', value: 'mccraw' },
    { label: 'Ben Mitchell Enterprises', value: 'ben_mitchell' },
    { label: 'Acme Corporation', value: 'acme' },
    { label: 'Global Industries', value: 'global' },
    { label: 'Tech Solutions Inc', value: 'tech' },
    { label: 'Energy Partners LLC', value: 'energy' },
  ];

  const productOptions: DropdownOption[] = [
    { label: '86 Conv E10', value: '86_conv_e10' },
    { label: '87 Conv E10', value: '87_conv_e10' },
    { label: 'Premium Gasoline', value: 'premium' },
    { label: 'Regular Gasoline', value: 'regular' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'E85', value: 'e85' },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    console.log('Date picker event:', event.type, selectedDate);
    
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
      setShowEndPicker(false);
    }

    if (event.type === 'dismissed') {
      setShowStartPicker(false);
      setShowEndPicker(false);
      return;
    }

    if (selectedDate) {
      if (datePickerMode === 'start') {
        setStartDate(selectedDate);
        if (Platform.OS === 'ios') {
          setShowStartPicker(false);
          setTimeout(() => {
            setDatePickerMode('end');
            setShowEndPicker(true);
          }, 300);
        }
      } else {
        setEndDate(selectedDate);
        if (Platform.OS === 'ios') {
          setShowEndPicker(false);
        }
      }
    }
  };

  const openDatePicker = () => {
    console.log('Opening date picker, Platform:', Platform.OS);
    if (Platform.OS === 'web') {
      setShowDateModal(true);
    } else {
      setDatePickerMode('start');
      setShowStartPicker(true);
    }
  };

  const handleSearch = () => {
    console.log('Searching deals with filters:', {
      dealStatus,
      selectedCustomer,
      selectedProduct,
      dateRange: { start: startDate, end: endDate },
    });
  };

  const handleView = (id: string) => {
    console.log('View deal:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Edit deal:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete deal:', id);
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <Modal
          visible={showDateModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDateModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDateModal(false)}
          >
            <View style={styles.dateModalContent}>
              <Text style={styles.dateModalTitle}>Select Date Range</Text>
              <View style={styles.dateInputsContainer}>
                <View style={styles.dateInputGroup}>
                  <Text style={styles.label}>Start Date</Text>
                  <TextInput
                    style={styles.input}
                    value={formatDate(startDate)}
                    editable={false}
                  />
                </View>
                <View style={styles.dateInputGroup}>
                  <Text style={styles.label}>End Date</Text>
                  <TextInput
                    style={styles.input}
                    value={formatDate(endDate)}
                    editable={false}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.dateModalButton}
                onPress={() => setShowDateModal(false)}
              >
                <Text style={styles.dateModalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      );
    }

    return (
      <>
        {showStartPicker && (
          <Modal
            visible={showStartPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowStartPicker(false)}
          >
            <View style={styles.datePickerModalOverlay}>
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <Text style={styles.datePickerTitle}>Select Start Date</Text>
                  <TouchableOpacity
                    style={styles.datePickerDoneButton}
                    onPress={() => {
                      setShowStartPicker(false);
                      setTimeout(() => {
                        setDatePickerMode('end');
                        setShowEndPicker(true);
                      }, 300);
                    }}
                  >
                    <Text style={styles.datePickerDoneText}>Next</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  style={styles.datePicker}
                />
              </View>
            </View>
          </Modal>
        )}
        {showEndPicker && (
          <Modal
            visible={showEndPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowEndPicker(false)}
          >
            <View style={styles.datePickerModalOverlay}>
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <Text style={styles.datePickerTitle}>Select End Date</Text>
                  <TouchableOpacity
                    style={styles.datePickerDoneButton}
                    onPress={() => setShowEndPicker(false)}
                  >
                    <Text style={styles.datePickerDoneText}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  style={styles.datePicker}
                  minimumDate={startDate}
                />
              </View>
            </View>
          </Modal>
        )}
      </>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Deal Submission</Text>
        <Text style={styles.subtitle}>Search and manage deal submissions</Text>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Dropdown
              label="Deal Status"
              placeholder="Awaiting Approval"
              value={dealStatus}
              options={dealStatusOptions}
              onValueChange={setDealStatus}
            />
          </View>

          <View style={styles.filterItem}>
            <View style={styles.dateRangeContainer}>
              <Text style={styles.label}>Date Range</Text>
              <TouchableOpacity
                style={styles.dateRangeButton}
                onPress={openDatePicker}
              >
                <IconSymbol
                  ios_icon_name="calendar"
                  android_material_icon_name="calendar_today"
                  size={20}
                  color={colors.textSecondary}
                />
                <Text style={styles.dateRangeText}>
                  {formatDate(startDate)} - {formatDate(endDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Dropdown
              label="Customer"
              placeholder="Select customer"
              value={selectedCustomer}
              options={customerOptions}
              onValueChange={setSelectedCustomer}
            />
          </View>

          <View style={styles.filterItem}>
            <Dropdown
              label="Product"
              placeholder="Select product"
              value={selectedProduct}
              options={productOptions}
              onValueChange={setSelectedProduct}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <IconSymbol
            ios_icon_name="magnifyingglass"
            android_material_icon_name="search"
            size={20}
            color={colors.white}
          />
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.customerColumn]}>Customer</Text>
              <Text style={[styles.tableHeaderCell, styles.dateRangeColumn]}>Date Range</Text>
              <Text style={[styles.tableHeaderCell, styles.dealTypeColumn]}>Deal Type</Text>
              <Text style={[styles.tableHeaderCell, styles.submissionColumn]}>Submission</Text>
              <Text style={[styles.tableHeaderCell, styles.locationColumn]}>Location</Text>
              <Text style={[styles.tableHeaderCell, styles.productColumn]}>Product</Text>
              <Text style={[styles.tableHeaderCell, styles.statusColumn]}>Status</Text>
              <Text style={[styles.tableHeaderCell, styles.actionsColumn]}>Actions</Text>
            </View>

            {dealSubmissions.map((deal, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                <Text style={[styles.tableCell, styles.customerColumn]}>{deal.customer}</Text>
                <Text style={[styles.tableCell, styles.dateRangeColumn]}>{deal.dateRange}</Text>
                <Text style={[styles.tableCell, styles.dealTypeColumn]} numberOfLines={2}>
                  {deal.dealType}
                </Text>
                <Text style={[styles.tableCell, styles.submissionColumn]}>{deal.submission}</Text>
                <Text style={[styles.tableCell, styles.locationColumn]}>{deal.location}</Text>
                <Text style={[styles.tableCell, styles.productColumn]}>{deal.product}</Text>
                <Text style={[styles.tableCell, styles.statusColumn, styles.statusText]}>
                  {deal.status}
                </Text>
                <View style={[styles.tableCell, styles.actionsColumn, styles.actionsContainer]}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEdit(deal.id)}
                  >
                    <IconSymbol
                      ios_icon_name="pencil"
                      android_material_icon_name="edit"
                      size={18}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleView(deal.id)}
                  >
                    <IconSymbol
                      ios_icon_name="eye"
                      android_material_icon_name="visibility"
                      size={18}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(deal.id)}
                  >
                    <IconSymbol
                      ios_icon_name="trash"
                      android_material_icon_name="delete"
                      size={18}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {renderDatePicker()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  filterSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  filterRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 16,
    marginBottom: 8,
  },
  filterItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
  },
  dateRangeContainer: {
    marginBottom: 8,
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 42,
  },
  dateRangeText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  table: {
    minWidth: Platform.OS === 'web' ? 1400 : 1200,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: colors.background,
  },
  tableCell: {
    fontSize: 13,
    color: colors.text,
    paddingHorizontal: 8,
  },
  customerColumn: {
    width: 180,
  },
  dateRangeColumn: {
    width: 180,
  },
  dealTypeColumn: {
    width: 300,
  },
  submissionColumn: {
    width: 220,
  },
  locationColumn: {
    width: 120,
  },
  productColumn: {
    width: 120,
  },
  statusColumn: {
    width: 140,
  },
  statusText: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  actionsColumn: {
    width: 120,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dateModalContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
    elevation: 5,
  },
  dateModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  dateInputsContainer: {
    marginBottom: 16,
  },
  dateInputGroup: {
    marginBottom: 12,
  },
  dateModalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateModalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  datePickerDoneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  datePickerDoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  datePicker: {
    width: '100%',
    height: 260,
  },
});
