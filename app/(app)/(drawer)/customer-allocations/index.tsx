
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
import { fetchCustomerAllocations } from '@/services/apiService';

const ITEMS_PER_PAGE = 10;

interface CustomerAllocation {
  id: string;
  customer: string;
  location: string;
  product: string;
  remaining_amount: number;
  lifting_percentage: number;
  refresh_period: string;
  lifting_number_type: string;
}

export default function CustomerAllocationsScreen() {
  const [data, setData] = useState<CustomerAllocation[]>([]);
  const [filteredData, setFilteredData] = useState<CustomerAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCustomerAllocations();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, data]);

  useEffect(() => {
    calculateTotalPages();
  }, [filteredData]);

  const loadCustomerAllocations = async () => {
    try {
      setLoading(true);
      console.log('CustomerAllocations: Fetching data');
      
      const allocations = await fetchCustomerAllocations();
      console.log('CustomerAllocations: Data fetched', allocations.length);
      
      setData(allocations);
      setFilteredData(allocations);
    } catch (error: any) {
      console.log('CustomerAllocations: Error', error.message);
      Alert.alert('Error', 'Failed to load customer allocations');
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
        item.customer?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.product?.toLowerCase().includes(query) ||
        item.lifting_number_type?.toLowerCase().includes(query)
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
    console.log('CustomerAllocations: Navigating back to home');
    router.push('/(app)/(drawer)/(home)');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString('en-US');
  };

  const getLiftingPercentageStyle = (percentage: number) => {
    if (percentage >= 100) {
      return styles.liftingBadgeHigh;
    } else if (percentage >= 50) {
      return styles.liftingBadgeMedium;
    }
    return styles.liftingBadgeLow;
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
            ios_icon_name="chart.pie.fill"
            android_material_icon_name="pie_chart"
            size={32}
            color={colors.primary}
          />
          <Text style={styles.headerTitle}>Allocation Details</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Customer allocations and lifting percentages by location
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Customer Allocations</Text>
        <Text style={styles.summarySubtitle}>
          Detailed lifting percentages by customer and location
        </Text>
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
              placeholder="Search customer, location, product, lifting type..."
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
          <Text style={styles.loadingText}>Loading customer allocations...</Text>
        </View>
      ) : filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol
            ios_icon_name="tray"
            android_material_icon_name="inbox"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyText}>No allocations found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Try adjusting your search' : 'No customer allocations available'}
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
                <Text style={[styles.tableHeaderCell, styles.customerColumn]}>Customer</Text>
                <Text style={[styles.tableHeaderCell, styles.locationColumn]}>Location</Text>
                <Text style={[styles.tableHeaderCell, styles.productColumn]}>Product</Text>
                <Text style={[styles.tableHeaderCell, styles.amountColumn]}>Remaining Amount</Text>
                <Text style={[styles.tableHeaderCell, styles.liftingColumn]}>Lifting %</Text>
                <Text style={[styles.tableHeaderCell, styles.refreshColumn]}>Refresh Period</Text>
                <Text style={[styles.tableHeaderCell, styles.typeColumn]}>Lifting Number Type</Text>
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
                      {item.customer || '-'}
                    </Text>
                    <Text style={[styles.tableCell, styles.locationColumn]}>
                      {item.location || '-'}
                    </Text>
                    <Text style={[styles.tableCell, styles.productColumn]}>
                      {item.product || '-'}
                    </Text>
                    <Text style={[styles.tableCell, styles.amountColumn, styles.numberText]}>
                      {formatNumber(item.remaining_amount)}
                    </Text>
                    <View style={[styles.tableCell, styles.liftingColumn]}>
                      <View style={[styles.liftingBadge, getLiftingPercentageStyle(item.lifting_percentage)]}>
                        <Text style={styles.liftingBadgeText}>
                          {item.lifting_percentage}%
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.tableCell, styles.refreshColumn]}>
                      {item.refresh_period || '-'}
                    </Text>
                    <Text style={[styles.tableCell, styles.typeColumn]}>
                      {item.lifting_number_type || '-'}
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
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
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
    width: 180,
  },
  locationColumn: {
    width: 180,
  },
  productColumn: {
    width: 120,
  },
  amountColumn: {
    width: 140,
  },
  liftingColumn: {
    width: 100,
  },
  refreshColumn: {
    width: 120,
  },
  typeColumn: {
    width: 180,
  },
  numberText: {
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  liftingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  liftingBadgeHigh: {
    backgroundColor: '#27ae60',
  },
  liftingBadgeMedium: {
    backgroundColor: colors.primary,
  },
  liftingBadgeLow: {
    backgroundColor: colors.secondary,
  },
  liftingBadgeText: {
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
