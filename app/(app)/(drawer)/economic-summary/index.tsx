
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
import { supabase } from '@/lib/supabase';
import { EconomicData } from '@/types/database.types';
import { router } from 'expo-router';

const ITEMS_PER_PAGE = 10;

export default function EconomicSummaryScreen() {
  const [data, setData] = useState<EconomicData[]>([]);
  const [filteredData, setFilteredData] = useState<EconomicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEconomicData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, data]);

  useEffect(() => {
    calculateTotalPages();
  }, [filteredData]);

  const fetchEconomicData = async () => {
    try {
      setLoading(true);
      console.log('EconomicSummary: Fetching economic data');
      
      const { data: economicData, error } = await supabase
        .from('economic_data')
        .select('*')
        .order('customer_name', { ascending: true });

      if (error) {
        console.log('EconomicSummary: Error fetching data', error);
        throw error;
      }

      console.log('EconomicSummary: Data fetched', economicData?.length);
      setData(economicData || []);
      setFilteredData(economicData || []);
    } catch (error: any) {
      console.log('EconomicSummary: Error', error.message);
      Alert.alert('Error', 'Failed to load economic data');
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
        item.product?.toLowerCase().includes(query)
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
    console.log('EconomicSummary: Navigating back to home');
    router.push('/(app)/(drawer)/(home)');
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
            ios_icon_name="dollarsign.circle.fill"
            android_material_icon_name="attach_money"
            size={32}
            color={colors.primary}
          />
          <Text style={styles.headerTitle}>Economic Summary</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Showing {filteredData.length} records
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <IconSymbol
          ios_icon_name="magnifyingglass"
          android_material_icon_name="search"
          size={20}
          color={colors.textSecondary}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by customer or product..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <IconSymbol
              ios_icon_name="xmark.circle.fill"
              android_material_icon_name="cancel"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading economic data...</Text>
        </View>
      ) : filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol
            ios_icon_name="tray"
            android_material_icon_name="inbox"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyText}>No data found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Try adjusting your search' : 'No economic data available'}
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
                <Text style={[styles.tableHeaderCell, styles.productColumn]}>Product</Text>
                <Text style={[styles.tableHeaderCell, styles.numberColumn]}>BPD</Text>
                <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Sale Diff</Text>
                <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Netback</Text>
                <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Netback TP</Text>
              </View>

              <ScrollView style={styles.tableBody}>
                {paginatedData.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                    ]}
                  >
                    <Text style={[styles.tableCell, styles.customerColumn]}>
                      {item.customer_name || '-'}
                    </Text>
                    <Text style={[styles.tableCell, styles.productColumn]}>
                      {item.product || '-'}
                    </Text>
                    <Text style={[styles.tableCell, styles.numberColumn, styles.numberText]}>
                      {formatNumber(item.bpd)}
                    </Text>
                    <Text style={[styles.tableCell, styles.numberColumn, styles.numberText]}>
                      {formatNumber(item.sale_diff)}
                    </Text>
                    <Text style={[styles.tableCell, styles.numberColumn, styles.numberText]}>
                      {formatNumber(item.netback)}
                    </Text>
                    <Text style={[styles.tableCell, styles.numberColumn, styles.numberText]}>
                      {formatNumber(item.netback_tp)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          <View style={styles.paginationContainer}>
            <View style={styles.paginationInfo}>
              <Text style={styles.paginationText}>
                Page {currentPage} of {totalPages}
              </Text>
              <Text style={styles.paginationSubtext}>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of{' '}
                {filteredData.length}
              </Text>
            </View>

            <View style={styles.paginationButtons}>
              <TouchableOpacity
                style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                onPress={handleFirstPage}
                disabled={currentPage === 1}
              >
                <IconSymbol
                  ios_icon_name="chevron.left.2"
                  android_material_icon_name="first_page"
                  size={20}
                  color={currentPage === 1 ? colors.border : colors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                onPress={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <IconSymbol
                  ios_icon_name="chevron.left"
                  android_material_icon_name="chevron_left"
                  size={20}
                  color={currentPage === 1 ? colors.border : colors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === totalPages && styles.paginationButtonDisabled,
                ]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <IconSymbol
                  ios_icon_name="chevron.right"
                  android_material_icon_name="chevron_right"
                  size={20}
                  color={currentPage === totalPages ? colors.border : colors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === totalPages && styles.paginationButtonDisabled,
                ]}
                onPress={handleLastPage}
                disabled={currentPage === totalPages}
              >
                <IconSymbol
                  ios_icon_name="chevron.right.2"
                  android_material_icon_name="last_page"
                  size={20}
                  color={currentPage === totalPages ? colors.border : colors.primary}
                />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    marginRight: 8,
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
    width: 150,
  },
  productColumn: {
    width: 120,
  },
  numberColumn: {
    width: 100,
  },
  numberText: {
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  paginationContainer: {
    backgroundColor: colors.card,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  paginationInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  paginationText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  paginationSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  paginationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paginationButtonDisabled: {
    opacity: 0.4,
  },
});
