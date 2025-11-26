
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import { fetchExpiringContracts } from '@/services/apiService';

const ITEMS_PER_PAGE = 10;

interface ExpiringContract {
  id: string;
  customer_name: string;
  city: string;
  deal_type: string;
  bpd: number;
  end_date: string;
}

export default function ExpiringContractsScreen() {
  const [data, setData] = useState<ExpiringContract[]>([]);
  const [filteredData, setFilteredData] = useState<ExpiringContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadExpiringContracts();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, data]);

  useEffect(() => {
    calculateTotalPages();
  }, [filteredData]);

  const loadExpiringContracts = async () => {
    try {
      setLoading(true);
      console.log('ExpiringContracts: Fetching data');
      
      const contracts = await fetchExpiringContracts();
      console.log('ExpiringContracts: Data fetched', contracts.length);
      
      setData(contracts);
      setFilteredData(contracts);
    } catch (error: any) {
      console.log('ExpiringContracts: Error', error.message);
      Alert.alert('Error', 'Failed to load expiring contracts');
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    if (!searchQuery.trim()) {
      setFilteredData(data);
      setCurrentPage(1);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.customer_name?.toLowerCase().includes(query) ||
        item.city?.toLowerCase().includes(query) ||
        item.deal_type?.toLowerCase().includes(query) ||
        item.end_date?.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const calculateTotalPages = () => {
    const pages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    setTotalPages(pages || 1);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleBackToHome = () => {
    console.log('ExpiringContracts: Navigating back to home');
    router.push('/(app)/(drawer)/(home)');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString('en-US');
  };

  const getDealTypeStyle = (dealType: string) => {
    const type = dealType?.toLowerCase();
    if (type?.includes('unbranded')) {
      return styles.dealTypeBadgeUnbranded;
    }
    return styles.dealTypeBadgeDefault;
  };

  const paginatedData = getPaginatedData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
        
        <View style={styles.headerTop}>
          <IconSymbol
            ios_icon_name="calendar.badge.exclamationmark"
            android_material_icon_name="event_busy"
            size={32}
            color={colors.primary}
          />
          <Text style={styles.headerTitle}>Expiring Contracts</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Contracts expiring in the next 90 days
        </Text>
        <Text style={styles.headerInfo}>
          Review and take action on upcoming contract expirations
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Contracts Expiring in Next 90 Days</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <IconSymbol
              ios_icon_name="magnifyingglass"
              android_material_icon_name="search"
              size={20}
              color={colors.textSecondary}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search customer, city, deal type, date..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.showingText}>
          Showing {filteredData.length} of {data.length}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading expiring contracts...</Text>
        </View>
      ) : filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol
            ios_icon_name="tray"
            android_material_icon_name="inbox"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyText}>No contracts found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Try adjusting your search' : 'No expiring contracts available'}
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.tableContainer}
            horizontal
            showsHorizontalScrollIndicator={true}
          >
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.customerColumn]}>Customer Name</Text>
                <Text style={[styles.tableHeaderCell, styles.cityColumn]}>City</Text>
                <Text style={[styles.tableHeaderCell, styles.dealTypeColumn]}>Deal Type</Text>
                <Text style={[styles.tableHeaderCell, styles.bpdColumn]}>BPD</Text>
                <Text style={[styles.tableHeaderCell, styles.dateColumn]}>End Date</Text>
              </View>

              <ScrollView style={styles.tableBody}>
                {paginatedData.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                    ]}
                  >
                    <Text style={[styles.tableCell, styles.customerColumn]}>
                      {item.customer_name || '-'}
                    </Text>
                    <Text style={[styles.tableCell, styles.cityColumn]}>
                      {item.city || '-'}
                    </Text>
                    <View style={[styles.tableCell, styles.dealTypeColumn]}>
                      <View style={[styles.dealTypeBadge, getDealTypeStyle(item.deal_type)]}>
                        <Text style={styles.dealTypeBadgeText}>
                          {item.deal_type || '-'}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.tableCell, styles.bpdColumn, styles.numberText]}>
                      {formatNumber(item.bpd)}
                    </Text>
                    <Text style={[styles.tableCell, styles.dateColumn]}>
                      {item.end_date || '-'}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          <View style={styles.paginationContainer}>
            <View style={styles.paginationInfo}>
              <Text style={styles.paginationText}>
                Page {currentPage} / {totalPages}
              </Text>
            </View>

            <View style={styles.paginationButtons}>
              <TouchableOpacity
                style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                onPress={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <Text style={[styles.paginationButtonText, currentPage === 1 && styles.paginationButtonTextDisabled]}>
                  Prev
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  styles.paginationButtonNext,
                  currentPage === totalPages && styles.paginationButtonDisabled,
                ]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <Text style={[styles.paginationButtonText, currentPage === totalPages && styles.paginationButtonTextDisabled]}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  header: {
    backgroundColor: colors.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 44,
  },
  headerInfo: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 44,
    marginTop: 4,
  },
  summaryContainer: {
    backgroundColor: colors.card,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    marginRight: 8,
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  showingText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  tableContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
  },
  table: {
    backgroundColor: colors.card,
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
    paddingHorizontal: 8,
  },
  tableBody: {
    maxHeight: 500,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: colors.card,
  },
  tableRowOdd: {
    backgroundColor: colors.background,
  },
  tableCell: {
    fontSize: 13,
    color: colors.text,
    paddingHorizontal: 8,
  },
  customerColumn: {
    width: 200,
  },
  cityColumn: {
    width: 150,
  },
  dealTypeColumn: {
    width: 180,
  },
  bpdColumn: {
    width: 100,
  },
  dateColumn: {
    width: 120,
  },
  numberText: {
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  dealTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  dealTypeBadgeDefault: {
    backgroundColor: colors.background,
  },
  dealTypeBadgeUnbranded: {
    backgroundColor: colors.primary,
  },
  dealTypeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  paginationContainer: {
    backgroundColor: colors.card,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paginationInfo: {
    flex: 1,
  },
  paginationText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: 8,
  },
  paginationButtonNext: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paginationButtonDisabled: {
    opacity: 0.4,
  },
  paginationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  paginationButtonTextDisabled: {
    color: colors.textSecondary,
  },
});
