
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import Dropdown, { DropdownOption } from '@/components/Dropdown';
import DateRangePicker from '@/components/DateRangePicker';

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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  // Sample data for the cards
  const [dealSubmissions] = useState<DealSubmission[]>([
    {
      id: '1',
      customer: 'Mccraw Oil Company, Inc',
      dateRange: '12/02/2024 - 12/02/2025',
      dealType: '3%(DKL U8 RACK POSTING - 87 CONV E10 ABILENE, TX - DKL + 3) +1',
      submission: 'Surya sudhakar Gogada - 12/02/2025',
      location: 'Abilene, TX',
      product: '86 Conv E10',
      status: 'Awaiting Approval',
    },
    {
      id: '2',
      customer: 'Ben Mitchell Enterprises',
      dateRange: '12/02/2024 - 12/02/2025',
      dealType: '(4%(PLATTS CBOB REG @ USGC PIPELINE + 4) + 33%(OPIS ETHANOL E100 @ CHICAGO, IL + 33) + 22%(RINS WHOLESALE + 3) +1)',
      submission: 'Surya sudhakar Gogada - 12/02/2025',
      location: 'Chicago, IL',
      product: '87 Conv E10',
      status: 'Awaiting Approval',
    },
    {
      id: '3',
      customer: 'Ben Mitchell Enterprises',
      dateRange: '12/02/2024 - 12/02/2025',
      dealType: '3%(DKL U8 RACK POSTING - 87 CONV E10 ABILENE, TX - DKL + 2) +1',
      submission: 'Surya sudhakar Gogada - 12/02/2025',
      location: 'Abilene, TX',
      product: '86 Conv E10',
      status: 'Approved',
    },
    {
      id: '4',
      customer: 'Global Energy Solutions',
      dateRange: '01/15/2024 - 01/15/2025',
      dealType: '2%(DKL U8 RACK POSTING - 87 CONV E10 HOUSTON, TX - DKL + 2) +0.5',
      submission: 'John Smith - 01/10/2025',
      location: 'Houston, TX',
      product: '87 Conv E10',
      status: 'Rejected',
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

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    console.log('Date range changed:', start, end);
    setStartDate(start);
    setEndDate(end);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Awaiting Approval':
        return '#FFA500';
      case 'Approved':
        return '#27ae60';
      case 'Rejected':
        return '#e74c3c';
      default:
        return colors.textSecondary;
    }
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
                onPress={() => setShowDateRangePicker(true)}
              >
                <IconSymbol
                  ios_icon_name="calendar"
                  android_material_icon_name="calendar_today"
                  size={20}
                  color={colors.textSecondary}
                />
                <Text style={styles.dateRangeText}>
                  {startDate && endDate
                    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                    : 'Select date range'}
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

      <View style={styles.dealsSection}>
        <View style={styles.dealsSectionHeader}>
          <Text style={styles.sectionTitle}>Showing {dealSubmissions.length} deals</Text>
        </View>

        {dealSubmissions.map((deal, index) => (
          <View key={index} style={styles.dealCard}>
            <View style={styles.dealCardHeader}>
              <Text style={styles.dealCustomerName}>{deal.customer}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(deal.status) }]}>
                <Text style={styles.statusText}>{deal.status}</Text>
              </View>
            </View>

            <Text style={styles.dealDateRange}>{deal.dateRange}</Text>

            <View style={styles.dealInfoSection}>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>PRODUCT</Text>
                <Text style={styles.dealInfoValue}>{deal.product}</Text>
              </View>

              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>LOCATION</Text>
                <Text style={styles.dealInfoValue}>{deal.location}</Text>
              </View>
            </View>

            <View style={styles.dealTypeSection}>
              <TouchableOpacity style={styles.hideDetailsButton}>
                <IconSymbol
                  ios_icon_name="chevron.up"
                  android_material_icon_name="expand_less"
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.hideDetailsText}>Hide Details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dealDetailsSection}>
              <View style={styles.dealDetailRow}>
                <Text style={styles.dealDetailLabel}>DEAL TYPE</Text>
                <Text style={styles.dealDetailValue}>{deal.dealType}</Text>
              </View>

              <View style={styles.dealDetailRow}>
                <Text style={styles.dealDetailLabel}>SUBMISSION</Text>
                <Text style={styles.dealDetailValue}>{deal.submission}</Text>
              </View>
            </View>

            <View style={styles.dealActions}>
              <TouchableOpacity
                style={styles.dealActionButton}
                onPress={() => handleEdit(deal.id)}
              >
                <IconSymbol
                  ios_icon_name="pencil"
                  android_material_icon_name="edit"
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dealActionButton}
                onPress={() => handleView(deal.id)}
              >
                <IconSymbol
                  ios_icon_name="eye"
                  android_material_icon_name="visibility"
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dealActionButton}
                onPress={() => handleDelete(deal.id)}
              >
                <IconSymbol
                  ios_icon_name="trash"
                  android_material_icon_name="delete"
                  size={18}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <DateRangePicker
        visible={showDateRangePicker}
        onClose={() => setShowDateRangePicker(false)}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
      />
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
    flex: 1,
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
  dealsSection: {
    marginBottom: 24,
  },
  dealsSectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  dealCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  dealCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dealCustomerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  dealDateRange: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  dealInfoSection: {
    marginBottom: 12,
  },
  dealInfoRow: {
    marginBottom: 8,
  },
  dealInfoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dealInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  dealTypeSection: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 12,
  },
  hideDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hideDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  dealDetailsSection: {
    marginBottom: 16,
  },
  dealDetailRow: {
    marginBottom: 12,
  },
  dealDetailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dealDetailValue: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  dealActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dealActionButton: {
    padding: 8,
    marginLeft: 12,
  },
});
