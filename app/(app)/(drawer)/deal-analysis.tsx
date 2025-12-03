
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import Dropdown, { DropdownOption } from '@/components/Dropdown';
import DateRangePicker from '@/components/DateRangePicker';

interface OptionData {
  location: string;
  product: string;
  galsMonth: string;
  lowerOn: boolean;
  rackOn: boolean;
  formulaTable1: FormulaRow[];
  formulaTable2: FormulaRow[];
  rackFormula: RackFormulaData;
}

interface FormulaRow {
  percentage: string;
  priceSource: string;
  source: string;
  adder: string;
}

interface RackFormulaData {
  percentage: string;
  serviceType: string;
  postingType: string;
  postingLocation: string;
  adder: string;
}

interface DealData {
  id: string;
  customerName: string;
  dateRange: string;
  product: string;
  location: string;
  dealType: string;
  submittedBy: string;
  submittedDate: string;
  status: 'Awaiting Approval' | 'Approved' | 'Rejected';
}

export default function DealAnalysisScreen() {
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [options, setOptions] = useState<OptionData[]>(
    Array(6).fill(null).map(() => ({
      location: '',
      product: '',
      galsMonth: '',
      lowerOn: false,
      rackOn: false,
      formulaTable1: [
        { percentage: '', priceSource: 'ARGUS', source: '', adder: '' },
        { percentage: '', priceSource: 'ARGUS', source: '', adder: '' },
        { percentage: '', priceSource: 'ARGUS', source: '', adder: '' },
      ],
      formulaTable2: [
        { percentage: '', priceSource: 'PLATTS', source: '', adder: '' },
        { percentage: '', priceSource: 'PLATTS', source: '', adder: '' },
        { percentage: '', priceSource: 'PLATTS', source: '', adder: '' },
      ],
      rackFormula: {
        percentage: '',
        serviceType: '',
        postingType: '',
        postingLocation: '',
        adder: '',
      },
    }))
  );

  // Sample deal data
  const [deals] = useState<DealData[]>([
    {
      id: '1',
      customerName: 'Mccraw Oil Company, Inc',
      dateRange: '12/02/2024 - 12/02/2025',
      product: '86 Conv E10',
      location: 'Abilene, TX',
      dealType: '3%(DKL U8 RACK POSTING - 87 CONV E10 ABILENE, TX - DKL + 3) +1',
      submittedBy: 'Surya sudhaker Gogada',
      submittedDate: '12/02/2025',
      status: 'Awaiting Approval',
    },
    {
      id: '2',
      customerName: 'Global Energy Solutions',
      dateRange: '01/15/2024 - 01/15/2025',
      product: '87 Conv E10',
      location: 'Houston, TX',
      dealType: '2%(DKL U8 RACK POSTING - 87 CONV E10 HOUSTON, TX - DKL + 2) +0.5',
      submittedBy: 'John Smith',
      submittedDate: '01/10/2025',
      status: 'Approved',
    },
    {
      id: '3',
      customerName: 'Midwest Petroleum',
      dateRange: '03/01/2024 - 03/01/2025',
      product: 'Diesel',
      location: 'Dallas, TX',
      dealType: '4%(DKL U8 RACK POSTING - DIESEL DALLAS, TX - DKL + 4) +2',
      submittedBy: 'Jane Doe',
      submittedDate: '02/28/2025',
      status: 'Awaiting Approval',
    },
    {
      id: '4',
      customerName: 'Pacific Oil & Gas',
      dateRange: '04/10/2024 - 04/10/2025',
      product: '91 Premium',
      location: 'Austin, TX',
      dealType: '5%(DKL U8 RACK POSTING - 91 PREMIUM AUSTIN, TX - DKL + 5) +1.5',
      submittedBy: 'Mike Johnson',
      submittedDate: '04/05/2025',
      status: 'Rejected',
    },
    {
      id: '5',
      customerName: 'Atlantic Resources',
      dateRange: '05/20/2024 - 05/20/2025',
      product: '86 Conv E10',
      location: 'San Antonio, TX',
      dealType: '3%(DKL U8 RACK POSTING - 86 CONV E10 SAN ANTONIO, TX - DKL + 3) +1',
      submittedBy: 'Sarah Williams',
      submittedDate: '05/15/2025',
      status: 'Awaiting Approval',
    },
  ]);

  const customerOptions: DropdownOption[] = [
    { label: 'Acme Corporation', value: 'acme' },
    { label: 'Global Industries', value: 'global' },
    { label: 'Tech Solutions Inc', value: 'tech' },
    { label: 'Energy Partners LLC', value: 'energy' },
  ];

  const locationOptions: DropdownOption[] = [
    { label: 'New York', value: 'ny' },
    { label: 'Los Angeles', value: 'la' },
    { label: 'Chicago', value: 'chicago' },
    { label: 'Houston', value: 'houston' },
    { label: 'Phoenix', value: 'phoenix' },
  ];

  const productOptions: DropdownOption[] = [
    { label: 'Premium Gasoline', value: 'premium' },
    { label: 'Regular Gasoline', value: 'regular' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'E85', value: 'e85' },
  ];

  const priceSourceOptions: DropdownOption[] = [
    { label: 'ARGUS', value: 'ARGUS' },
    { label: 'PLATTS', value: 'PLATTS' },
    { label: 'OPIS', value: 'OPIS' },
    { label: 'DTN', value: 'DTN' },
  ];

  const sourceOptions: DropdownOption[] = [
    { label: 'Select source first', value: '' },
    { label: 'Source A', value: 'source_a' },
    { label: 'Source B', value: 'source_b' },
    { label: 'Source C', value: 'source_c' },
    { label: 'Source D', value: 'source_d' },
  ];

  const serviceTypeOptions: DropdownOption[] = [
    { label: 'Select service first', value: '' },
    { label: 'Standard Service', value: 'standard' },
    { label: 'Express Service', value: 'express' },
    { label: 'Premium Service', value: 'premium' },
  ];

  const postingTypeOptions: DropdownOption[] = [
    { label: 'Select posting type first', value: '' },
    { label: 'Type A', value: 'type_a' },
    { label: 'Type B', value: 'type_b' },
    { label: 'Type C', value: 'type_c' },
  ];

  const postingLocationOptions: DropdownOption[] = [
    { label: 'Select posting & location first', value: '' },
    { label: 'Location 1', value: 'loc_1' },
    { label: 'Location 2', value: 'loc_2' },
    { label: 'Location 3', value: 'loc_3' },
  ];

  const updateOption = (index: number, field: keyof OptionData, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const updateFormulaRow = (
    optionIndex: number,
    tableType: 'formulaTable1' | 'formulaTable2',
    rowIndex: number,
    field: keyof FormulaRow,
    value: string
  ) => {
    const newOptions = [...options];
    const table = [...newOptions[optionIndex][tableType]];
    table[rowIndex] = { ...table[rowIndex], [field]: value };
    newOptions[optionIndex] = { ...newOptions[optionIndex], [tableType]: table };
    setOptions(newOptions);
  };

  const updateRackFormula = (
    optionIndex: number,
    field: keyof RackFormulaData,
    value: string
  ) => {
    const newOptions = [...options];
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      rackFormula: { ...newOptions[optionIndex].rackFormula, [field]: value },
    };
    setOptions(newOptions);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return 'Select date range';
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const handleSaveAnalysis = () => {
    console.log('Deal Analysis: Saving analysis', {
      customer: isNewCustomer ? newCustomerName : selectedCustomer,
      dateRange: { start: startDate, end: endDate },
      options,
    });
  };

  const handleDateRangeChange = (newStartDate: Date | null, newEndDate: Date | null) => {
    console.log('Date range changed:', newStartDate, newEndDate);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
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

  const handleEditDeal = (dealId: string) => {
    console.log('Deal Analysis: Editing deal', dealId);
  };

  const handleViewDeal = (dealId: string) => {
    console.log('Deal Analysis: Viewing deal', dealId);
  };

  const handleDeleteDeal = (dealId: string) => {
    console.log('Deal Analysis: Deleting deal', dealId);
  };

  const renderFormulaTable1 = (optionIndex: number, option: OptionData) => {
    return (
      <View style={styles.formulaTable}>
        <Text style={styles.formulaTableTitle}>Formula Tablet 1:</Text>
        {option.formulaTable1.map((row, rowIndex) => (
          <View key={rowIndex}>
            <View style={styles.formulaRowTop}>
              <View style={styles.formulaPercentageNew}>
                <TextInput
                  style={styles.input}
                  placeholder="%"
                  placeholderTextColor={colors.textSecondary}
                  value={row.percentage}
                  onChangeText={(value) =>
                    updateFormulaRow(optionIndex, 'formulaTable1', rowIndex, 'percentage', value)
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formulaAdderNew}>
                <TextInput
                  style={styles.input}
                  placeholder="Adder"
                  placeholderTextColor={colors.textSecondary}
                  value={row.adder}
                  onChangeText={(value) =>
                    updateFormulaRow(optionIndex, 'formulaTable1', rowIndex, 'adder', value)
                  }
                />
              </View>
            </View>
            <View style={styles.formulaRowBottom}>
              <View style={styles.formulaPriceSourceNew}>
                <Dropdown
                  placeholder="ARGUS"
                  value={row.priceSource}
                  options={priceSourceOptions}
                  onValueChange={(value) =>
                    updateFormulaRow(optionIndex, 'formulaTable1', rowIndex, 'priceSource', value)
                  }
                />
              </View>
              <View style={styles.formulaSourceNew}>
                <Dropdown
                  placeholder="Select source first"
                  value={row.source}
                  options={sourceOptions}
                  onValueChange={(value) =>
                    updateFormulaRow(optionIndex, 'formulaTable1', rowIndex, 'source', value)
                  }
                />
              </View>
            </View>
            {rowIndex < option.formulaTable1.length - 1 && (
              <View style={styles.formulaRowSeparator} />
            )}
          </View>
        ))}
        <View style={styles.formulaFooter}>
          <View style={styles.formulaFooterItem}>
            <Text style={styles.formulaFooterLabel}>Freight or Rebate</Text>
            <TextInput
              style={styles.input}
              placeholder="Discount"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.formulaFooterItem}>
            <Text style={styles.formulaFooterLabel}>Overall Division (Gross Up)</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              placeholderTextColor={colors.textSecondary}
              defaultValue="1"
            />
          </View>
        </View>
      </View>
    );
  };

  const renderFormulaTable2 = (optionIndex: number, option: OptionData) => {
    return (
      <View style={styles.formulaTable}>
        <Text style={styles.formulaTableTitle}>Formula Tablet 2:</Text>
        {option.formulaTable2.map((row, rowIndex) => (
          <View key={rowIndex}>
            <View style={styles.formulaRowTop}>
              <View style={styles.formulaPercentageNew}>
                <TextInput
                  style={styles.input}
                  placeholder="%"
                  placeholderTextColor={colors.textSecondary}
                  value={row.percentage}
                  onChangeText={(value) =>
                    updateFormulaRow(optionIndex, 'formulaTable2', rowIndex, 'percentage', value)
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formulaAdderNew}>
                <TextInput
                  style={styles.input}
                  placeholder="Adder"
                  placeholderTextColor={colors.textSecondary}
                  value={row.adder}
                  onChangeText={(value) =>
                    updateFormulaRow(optionIndex, 'formulaTable2', rowIndex, 'adder', value)
                  }
                />
              </View>
            </View>
            <View style={styles.formulaRowBottom}>
              <View style={styles.formulaPriceSourceNew}>
                <Dropdown
                  placeholder="PLATTS"
                  value={row.priceSource}
                  options={priceSourceOptions}
                  onValueChange={(value) =>
                    updateFormulaRow(optionIndex, 'formulaTable2', rowIndex, 'priceSource', value)
                  }
                />
              </View>
              <View style={styles.formulaSourceNew}>
                <Dropdown
                  placeholder="Select source first"
                  value={row.source}
                  options={sourceOptions}
                  onValueChange={(value) =>
                    updateFormulaRow(optionIndex, 'formulaTable2', rowIndex, 'source', value)
                  }
                />
              </View>
            </View>
            {rowIndex < option.formulaTable2.length - 1 && (
              <View style={styles.formulaRowSeparator} />
            )}
          </View>
        ))}
        <View style={styles.formulaFooter}>
          <View style={styles.formulaFooterItem}>
            <Text style={styles.formulaFooterLabel}>Freight or Rebate</Text>
            <TextInput
              style={styles.input}
              placeholder="Discount"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.formulaFooterItem}>
            <Text style={styles.formulaFooterLabel}>Overall Division (Gross Up)</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              placeholderTextColor={colors.textSecondary}
              defaultValue="1"
            />
          </View>
        </View>
      </View>
    );
  };

  const renderRackFormula = (optionIndex: number, option: OptionData) => {
    return (
      <View style={styles.formulaTable}>
        <Text style={styles.formulaTableTitle}>Formula Tablet 1:</Text>
        <View style={styles.rackFormulaRow}>
          <View style={styles.rackPercentageInput}>
            <TextInput
              style={styles.input}
              placeholder="%"
              placeholderTextColor={colors.textSecondary}
              value={option.rackFormula.percentage}
              onChangeText={(value) => updateRackFormula(optionIndex, 'percentage', value)}
            />
          </View>
          <View style={styles.rackEmptySpace} />
        </View>
        <View style={styles.rackFormulaRow}>
          <View style={styles.rackDropdown}>
            <Dropdown
              placeholder="Select service first"
              value={option.rackFormula.serviceType}
              options={serviceTypeOptions}
              onValueChange={(value) => updateRackFormula(optionIndex, 'serviceType', value)}
            />
          </View>
          <View style={styles.rackDropdown}>
            <Dropdown
              placeholder="Select posting type first"
              value={option.rackFormula.postingType}
              options={postingTypeOptions}
              onValueChange={(value) => updateRackFormula(optionIndex, 'postingType', value)}
            />
          </View>
        </View>
        <View style={styles.rackFormulaRow}>
          <View style={styles.rackDropdown}>
            <Dropdown
              placeholder="Select posting & location first"
              value={option.rackFormula.postingLocation}
              options={postingLocationOptions}
              onValueChange={(value) => updateRackFormula(optionIndex, 'postingLocation', value)}
            />
          </View>
          <View style={styles.rackAdder}>
            <TextInput
              style={styles.input}
              placeholder="Adder"
              placeholderTextColor={colors.textSecondary}
              value={option.rackFormula.adder}
              onChangeText={(value) => updateRackFormula(optionIndex, 'adder', value)}
            />
          </View>
        </View>
        <View style={styles.formulaFooter}>
          <View style={styles.formulaFooterItem}>
            <Text style={styles.formulaFooterLabel}>Freight Allowance or Rebate</Text>
            <TextInput
              style={styles.input}
              placeholder="Discount"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderOption = (option: OptionData, index: number) => {
    return (
      <View key={index} style={styles.optionCard}>
        <Text style={styles.optionTitle}>OPTION {index + 1}</Text>

        <Dropdown
          label="Select Location:"
          placeholder="Select location"
          value={option.location}
          options={locationOptions}
          onValueChange={(value) => updateOption(index, 'location', value)}
        />

        <Dropdown
          label="Select Product:"
          placeholder="Select location first"
          value={option.product}
          options={productOptions}
          onValueChange={(value) => updateOption(index, 'product', value)}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gals/Month:</Text>
          <TextInput
            style={styles.input}
            placeholder="Gallons"
            placeholderTextColor={colors.textSecondary}
            value={option.galsMonth}
            onChangeText={(value) => updateOption(index, 'galsMonth', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.togglesRow}>
          <View style={styles.toggleGroup}>
            <Text style={styles.toggleLabel}>LOWER OF</Text>
            <TouchableOpacity
              style={[styles.toggle, option.lowerOn && styles.toggleActive]}
              onPress={() => updateOption(index, 'lowerOn', !option.lowerOn)}
            >
              <View style={[styles.toggleThumb, option.lowerOn && styles.toggleThumbActive]} />
            </TouchableOpacity>
            <Text style={styles.toggleStateLabel}>{option.lowerOn ? 'ON' : 'OFF'}</Text>
          </View>

          <View style={styles.toggleGroup}>
            <Text style={styles.toggleLabel}>RACK</Text>
            <TouchableOpacity
              style={[styles.toggle, option.rackOn && styles.toggleActive]}
              onPress={() => updateOption(index, 'rackOn', !option.rackOn)}
            >
              <View style={[styles.toggleThumb, option.rackOn && styles.toggleThumbActive]} />
            </TouchableOpacity>
            <Text style={styles.toggleStateLabel}>{option.rackOn ? 'ON' : 'OFF'}</Text>
          </View>
        </View>

        {option.lowerOn && !option.rackOn && (
          <React.Fragment>
            {renderFormulaTable1(index, option)}
            {renderFormulaTable2(index, option)}
          </React.Fragment>
        )}

        {option.rackOn && renderRackFormula(index, option)}

        {!option.lowerOn && !option.rackOn && renderFormulaTable1(index, option)}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Deal Analysis</Text>
          <Text style={styles.subtitle}>Analyze and configure deal options with detailed parameters</Text>
        </View>

        <View style={styles.analysisSection}>
          <Text style={styles.sectionTitle}>Analysis Option</Text>
          <Text style={styles.sectionSubtitle}>Select the customer and date for this deal analysis</Text>

          <View style={styles.customerSection}>
            <View style={styles.toggleContainer}>
              <Text style={styles.label}>New Customer</Text>
              <TouchableOpacity
                style={[styles.toggle, isNewCustomer && styles.toggleActive]}
                onPress={() => setIsNewCustomer(!isNewCustomer)}
              >
                <View style={[styles.toggleThumb, isNewCustomer && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>

            {isNewCustomer ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Customer Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new customer name"
                  placeholderTextColor={colors.textSecondary}
                  value={newCustomerName}
                  onChangeText={setNewCustomerName}
                />
              </View>
            ) : (
              <Dropdown
                label="Select Customer"
                placeholder="All customers"
                value={selectedCustomer}
                options={customerOptions}
                onValueChange={setSelectedCustomer}
              />
            )}

            <View style={styles.dateRangeContainer}>
              <Text style={styles.label}>Date Range</Text>
              <TouchableOpacity
                style={styles.dateRangeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <IconSymbol
                  ios_icon_name="calendar"
                  android_material_icon_name="calendar_today"
                  size={20}
                  color={colors.textSecondary}
                />
                <Text style={styles.dateRangeText}>
                  {formatDateRange()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.dealsSection}>
          <View style={styles.dealsSectionHeader}>
            <Text style={styles.sectionTitle}>Showing {deals.length} deals</Text>
          </View>

          {deals.map((deal, index) => (
            <View key={index} style={styles.dealCard}>
              <View style={styles.dealCardHeader}>
                <Text style={styles.dealCustomerName}>{deal.customerName}</Text>
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
                  <Text style={styles.dealDetailValue}>
                    {deal.submittedBy} - {deal.submittedDate}
                  </Text>
                </View>
              </View>

              <View style={styles.dealActions}>
                <TouchableOpacity
                  style={styles.dealActionButton}
                  onPress={() => handleEditDeal(deal.id)}
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
                  onPress={() => handleViewDeal(deal.id)}
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
                  onPress={() => handleDeleteDeal(deal.id)}
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

        <View style={styles.optionsContainer}>
          {options.map((option, index) => renderOption(option, index))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveAnalysis}>
            <Text style={styles.saveButtonText}>Save Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <DateRangePicker
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
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
  analysisSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  customerSection: {
    marginTop: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    marginLeft: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  inputGroup: {
    marginBottom: 16,
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
  },
  dateRangeText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  dealsSection: {
    marginBottom: 24,
  },
  dealsSectionHeader: {
    marginBottom: 16,
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
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  togglesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  toggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  toggleStateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  formulaTable: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formulaTableTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  formulaRowTop: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  formulaRowBottom: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  formulaPercentageNew: {
    flex: 1,
  },
  formulaAdderNew: {
    flex: 1,
  },
  formulaPriceSourceNew: {
    flex: 1,
  },
  formulaSourceNew: {
    flex: 1,
  },
  formulaRowSeparator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  formulaFooter: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  formulaFooterItem: {
    marginBottom: 12,
  },
  formulaFooterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  rackFormulaRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  rackPercentageInput: {
    flex: 1,
  },
  rackEmptySpace: {
    flex: 1,
  },
  rackDropdown: {
    flex: 1,
  },
  rackAdder: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
