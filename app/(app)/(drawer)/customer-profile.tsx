
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
  KeyboardAvoidingView,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import Dropdown, { DropdownOption } from '@/components/Dropdown';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Comment, EconomicData } from '@/types/database.types';
import { fetchExpiringContracts, fetchCustomerAllocations } from '@/services/apiService';
import * as ImagePicker from 'expo-image-picker';

const ITEMS_PER_PAGE = 5;

interface ExpiringContract {
  id: string;
  customer_name: string;
  city: string;
  deal_type: string;
  bpd: number;
  end_date: string;
}

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

export default function CustomerProfileScreen() {
  const { user } = useAuth();
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customers, setCustomers] = useState<DropdownOption[]>([]);
  
  const [economicData, setEconomicData] = useState<EconomicData[]>([]);
  const [filteredEconomicData, setFilteredEconomicData] = useState<EconomicData[]>([]);
  const [economicSearchQuery, setEconomicSearchQuery] = useState('');
  const [economicCurrentPage, setEconomicCurrentPage] = useState(1);
  const [economicTotalPages, setEconomicTotalPages] = useState(1);
  const [loadingEconomic, setLoadingEconomic] = useState(false);

  const [expiringContracts, setExpiringContracts] = useState<ExpiringContract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<ExpiringContract[]>([]);
  const [contractsSearchQuery, setContractsSearchQuery] = useState('');
  const [contractsCurrentPage, setContractsCurrentPage] = useState(1);
  const [contractsTotalPages, setContractsTotalPages] = useState(1);
  const [loadingContracts, setLoadingContracts] = useState(false);

  const [allocations, setAllocations] = useState<CustomerAllocation[]>([]);
  const [filteredAllocations, setFilteredAllocations] = useState<CustomerAllocation[]>([]);
  const [allocationsSearchQuery, setAllocationsSearchQuery] = useState('');
  const [allocationsCurrentPage, setAllocationsCurrentPage] = useState(1);
  const [allocationsTotalPages, setAllocationsTotalPages] = useState(1);
  const [loadingAllocations, setLoadingAllocations] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [subject, setSubject] = useState('Sales Request Comment');
  const [submissionType, setSubmissionType] = useState('General');
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);

  const subjectOptions: DropdownOption[] = [
    { label: 'Sales Request Comment', value: 'Sales Request Comment' },
    { label: 'Technical Support', value: 'Technical Support' },
    { label: 'Billing Inquiry', value: 'Billing Inquiry' },
    { label: 'Product Feedback', value: 'Product Feedback' },
    { label: 'General Inquiry', value: 'General Inquiry' },
  ];

  const submissionTypeOptions: DropdownOption[] = [
    { label: 'General', value: 'General' },
    { label: 'RFP/Offer', value: 'RFP/Offer' },
    { label: 'Contract Upload', value: 'Contract Upload' },
    { label: 'Lead', value: 'Lead' },
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      loadCustomerData();
    }
  }, [selectedCustomer]);

  useEffect(() => {
    filterEconomicData();
  }, [economicSearchQuery, economicData]);

  useEffect(() => {
    filterContracts();
  }, [contractsSearchQuery, expiringContracts]);

  useEffect(() => {
    filterAllocations();
  }, [allocationsSearchQuery, allocations]);

  useEffect(() => {
    calculateEconomicPages();
  }, [filteredEconomicData]);

  useEffect(() => {
    calculateContractsPages();
  }, [filteredContracts]);

  useEffect(() => {
    calculateAllocationsPages();
  }, [filteredAllocations]);

  const fetchCustomers = async () => {
    try {
      console.log('CustomerProfile: Fetching customers');
      const { data, error } = await supabase
        .from('comments')
        .select('customer_name')
        .not('customer_name', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const uniqueCustomers = Array.from(
        new Set(data?.map((item) => item.customer_name) || [])
      );

      const customerOptions: DropdownOption[] = uniqueCustomers.map((name) => ({
        label: name,
        value: name,
      }));

      // Add sample customers if the list is empty or has fewer than 3 customers
      if (customerOptions.length < 3) {
        const sampleCustomers: DropdownOption[] = [
          { label: 'Acme Corporation', value: 'Acme Corporation' },
          { label: 'Global Energy Solutions', value: 'Global Energy Solutions' },
          { label: 'Midwest Petroleum', value: 'Midwest Petroleum' },
          { label: 'Pacific Oil & Gas', value: 'Pacific Oil & Gas' },
          { label: 'Atlantic Resources', value: 'Atlantic Resources' },
        ];

        // Merge existing customers with sample customers, avoiding duplicates
        const existingValues = new Set(customerOptions.map(c => c.value));
        const uniqueSampleCustomers = sampleCustomers.filter(
          sample => !existingValues.has(sample.value)
        );

        customerOptions.push(...uniqueSampleCustomers);
      }

      console.log('CustomerProfile: Customers fetched', customerOptions.length);
      setCustomers(customerOptions);
    } catch (error: any) {
      console.log('CustomerProfile: Error fetching customers', error.message);
      
      // If there's an error, still provide sample customers
      const sampleCustomers: DropdownOption[] = [
        { label: 'Acme Corporation', value: 'Acme Corporation' },
        { label: 'Global Energy Solutions', value: 'Global Energy Solutions' },
        { label: 'Midwest Petroleum', value: 'Midwest Petroleum' },
        { label: 'Pacific Oil & Gas', value: 'Pacific Oil & Gas' },
        { label: 'Atlantic Resources', value: 'Atlantic Resources' },
      ];
      setCustomers(sampleCustomers);
    }
  };

  const loadCustomerData = async () => {
    console.log('CustomerProfile: Loading data for customer', selectedCustomer);
    await Promise.all([
      fetchEconomicData(),
      fetchContractsData(),
      fetchAllocationsData(),
      fetchComments(),
    ]);
  };

  const fetchEconomicData = async () => {
    try {
      setLoadingEconomic(true);
      console.log('CustomerProfile: Fetching economic data');
      
      const { data, error } = await supabase
        .from('economic_data')
        .select('*')
        .eq('customer_name', selectedCustomer)
        .order('product', { ascending: true });

      if (error) throw error;

      console.log('CustomerProfile: Economic data fetched', data?.length);
      setEconomicData(data || []);
      setFilteredEconomicData(data || []);
      setEconomicCurrentPage(1);
    } catch (error: any) {
      console.log('CustomerProfile: Error fetching economic data', error.message);
      Alert.alert('Error', 'Failed to load economic data');
    } finally {
      setLoadingEconomic(false);
    }
  };

  const fetchContractsData = async () => {
    try {
      setLoadingContracts(true);
      console.log('CustomerProfile: Fetching contracts data');
      
      const allContracts = await fetchExpiringContracts();
      const customerContracts = allContracts.filter(
        (contract) => contract.customer_name === selectedCustomer
      );

      console.log('CustomerProfile: Contracts data fetched', customerContracts.length);
      setExpiringContracts(customerContracts);
      setFilteredContracts(customerContracts);
      setContractsCurrentPage(1);
    } catch (error: any) {
      console.log('CustomerProfile: Error fetching contracts', error.message);
      Alert.alert('Error', 'Failed to load contracts data');
    } finally {
      setLoadingContracts(false);
    }
  };

  const fetchAllocationsData = async () => {
    try {
      setLoadingAllocations(true);
      console.log('CustomerProfile: Fetching allocations data');
      
      const allAllocations = await fetchCustomerAllocations();
      const customerAllocations = allAllocations.filter(
        (allocation) => allocation.customer.toLowerCase().includes(selectedCustomer.toLowerCase())
      );

      console.log('CustomerProfile: Allocations data fetched', customerAllocations.length);
      setAllocations(customerAllocations);
      setFilteredAllocations(customerAllocations);
      setAllocationsCurrentPage(1);
    } catch (error: any) {
      console.log('CustomerProfile: Error fetching allocations', error.message);
      Alert.alert('Error', 'Failed to load allocations data');
    } finally {
      setLoadingAllocations(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      console.log('CustomerProfile: Fetching comments');
      
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('customer_name', selectedCustomer)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      console.log('CustomerProfile: Comments fetched', data?.length);
      setComments(data || []);
    } catch (error: any) {
      console.log('CustomerProfile: Error fetching comments', error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const filterEconomicData = () => {
    if (!economicSearchQuery.trim()) {
      setFilteredEconomicData(economicData);
      setEconomicCurrentPage(1);
      return;
    }

    const query = economicSearchQuery.toLowerCase();
    const filtered = economicData.filter(
      (item) =>
        item.customer_name?.toLowerCase().includes(query) ||
        item.product?.toLowerCase().includes(query)
    );

    setFilteredEconomicData(filtered);
    setEconomicCurrentPage(1);
  };

  const filterContracts = () => {
    if (!contractsSearchQuery.trim()) {
      setFilteredContracts(expiringContracts);
      setContractsCurrentPage(1);
      return;
    }

    const query = contractsSearchQuery.toLowerCase();
    const filtered = expiringContracts.filter(
      (item) =>
        item.city?.toLowerCase().includes(query) ||
        item.deal_type?.toLowerCase().includes(query) ||
        item.end_date?.toLowerCase().includes(query)
    );

    setFilteredContracts(filtered);
    setContractsCurrentPage(1);
  };

  const filterAllocations = () => {
    if (!allocationsSearchQuery.trim()) {
      setFilteredAllocations(allocations);
      setAllocationsCurrentPage(1);
      return;
    }

    const query = allocationsSearchQuery.toLowerCase();
    const filtered = allocations.filter(
      (item) =>
        item.location?.toLowerCase().includes(query) ||
        item.product?.toLowerCase().includes(query) ||
        item.lifting_number_type?.toLowerCase().includes(query)
    );

    setFilteredAllocations(filtered);
    setAllocationsCurrentPage(1);
  };

  const calculateEconomicPages = () => {
    const pages = Math.ceil(filteredEconomicData.length / ITEMS_PER_PAGE);
    setEconomicTotalPages(pages || 1);
  };

  const calculateContractsPages = () => {
    const pages = Math.ceil(filteredContracts.length / ITEMS_PER_PAGE);
    setContractsTotalPages(pages || 1);
  };

  const calculateAllocationsPages = () => {
    const pages = Math.ceil(filteredAllocations.length / ITEMS_PER_PAGE);
    setAllocationsTotalPages(pages || 1);
  };

  const getPaginatedEconomicData = () => {
    const startIndex = (economicCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredEconomicData.slice(startIndex, endIndex);
  };

  const getPaginatedContracts = () => {
    const startIndex = (contractsCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredContracts.slice(startIndex, endIndex);
  };

  const getPaginatedAllocations = () => {
    const startIndex = (allocationsCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAllocations.slice(startIndex, endIndex);
  };

  const handlePickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedFiles([...selectedFiles, ...result.assets]);
        console.log('CustomerProfile: Files selected', result.assets.length);
      }
    } catch (error) {
      console.log('CustomerProfile: Error picking file', error);
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    if (!selectedCustomer) {
      Alert.alert('Error', 'Please select a customer');
      return;
    }

    try {
      setSubmittingComment(true);
      console.log('CustomerProfile: Submitting comment');

      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            author: user?.id,
            customer_name: selectedCustomer,
            subject: subject,
            submission_type: submissionType,
            body: commentText,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      console.log('CustomerProfile: Comment submitted', data.id);

      if (selectedFiles.length > 0) {
        console.log('CustomerProfile: Uploading attachments', selectedFiles.length);
        for (const file of selectedFiles) {
          const fileName = `${Date.now()}_${file.fileName || 'file'}`;
          const { error: uploadError } = await supabase.storage
            .from('attachments')
            .upload(fileName, file.uri);

          if (!uploadError) {
            await supabase.from('attachments').insert([
              {
                comment_id: data.id,
                filename: file.fileName || 'file',
                storage_path: fileName,
                mime_type: file.type || 'image',
                size: file.fileSize || 0,
              },
            ]);
          }
        }
      }

      setCommentText('');
      setSelectedFiles([]);
      fetchComments();
      Alert.alert('Success', 'Comment posted successfully');
    } catch (error: any) {
      console.log('CustomerProfile: Error', error.message);
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      console.log('CustomerProfile: Liking comment', commentId);
      const { error } = await supabase.from('reactions').insert([
        {
          comment_id: commentId,
          user_id: user?.id,
          type: 'like',
        },
      ]);

      if (error) throw error;
      console.log('CustomerProfile: Comment liked');
    } catch (error: any) {
      console.log('CustomerProfile: Error liking comment', error.message);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      console.log('CustomerProfile: Deleting comment', commentId);
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      console.log('CustomerProfile: Comment deleted');
      fetchComments();
    } catch (error: any) {
      console.log('CustomerProfile: Error deleting comment', error.message);
      Alert.alert('Error', 'Failed to delete comment');
    }
  };

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  const getCommentAuthorName = (comment: Comment) => {
    return comment.author || 'Unknown User';
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatInteger = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString('en-US');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <IconSymbol
            ios_icon_name="person.2.fill"
            android_material_icon_name="people"
            size={32}
            color={colors.primary}
          />
          <Text style={styles.headerTitle}>Customer Profile</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Detailed view of customer information and interactions
        </Text>
      </View>

      <View style={styles.customerSelector}>
        <Dropdown
          label="Select Customer"
          placeholder="Choose a customer to view their profile"
          value={selectedCustomer}
          options={customers}
          onValueChange={setSelectedCustomer}
        />
      </View>

      {selectedCustomer ? (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol
                ios_icon_name="dollarsign.circle.fill"
                android_material_icon_name="attach_money"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.sectionTitle}>Economic Summary</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Production & economics for {selectedCustomer}
            </Text>

            <View style={styles.searchContainer}>
              <IconSymbol
                ios_icon_name="magnifyingglass"
                android_material_icon_name="search"
                size={20}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by product..."
                placeholderTextColor={colors.textSecondary}
                value={economicSearchQuery}
                onChangeText={setEconomicSearchQuery}
              />
              {economicSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setEconomicSearchQuery('')}>
                  <IconSymbol
                    ios_icon_name="xmark.circle.fill"
                    android_material_icon_name="cancel"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>

            {loadingEconomic ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            ) : filteredEconomicData.length === 0 ? (
              <Text style={styles.noData}>No economic data available</Text>
            ) : (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderCell, styles.customerColumn]}>Customer</Text>
                      <Text style={[styles.tableHeaderCell, styles.productColumn]}>Product</Text>
                      <Text style={[styles.tableHeaderCell, styles.numberColumn]}>BPD</Text>
                      <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Sale Diff</Text>
                      <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Netback</Text>
                      <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Netback TP</Text>
                    </View>
                    {getPaginatedEconomicData().map((item, index) => (
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
                  </View>
                </ScrollView>

                <View style={styles.pagination}>
                  <Text style={styles.paginationText}>
                    Showing {(economicCurrentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                    {Math.min(economicCurrentPage * ITEMS_PER_PAGE, filteredEconomicData.length)} of{' '}
                    {filteredEconomicData.length}
                  </Text>
                  <View style={styles.paginationButtons}>
                    <TouchableOpacity
                      style={[
                        styles.paginationButton,
                        economicCurrentPage === 1 && styles.paginationButtonDisabled,
                      ]}
                      onPress={() => setEconomicCurrentPage(economicCurrentPage - 1)}
                      disabled={economicCurrentPage === 1}
                    >
                      <Text style={styles.paginationButtonText}>Prev</Text>
                    </TouchableOpacity>
                    <Text style={styles.pageNumber}>
                      {economicCurrentPage} / {economicTotalPages}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.paginationButton,
                        economicCurrentPage === economicTotalPages && styles.paginationButtonDisabled,
                      ]}
                      onPress={() => setEconomicCurrentPage(economicCurrentPage + 1)}
                      disabled={economicCurrentPage === economicTotalPages}
                    >
                      <Text style={styles.paginationButtonText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol
                ios_icon_name="calendar.badge.exclamationmark"
                android_material_icon_name="event_busy"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.sectionTitle}>Contracts Expiring in Next 90 Days</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Contracts for {selectedCustomer}
            </Text>

            <View style={styles.searchContainer}>
              <IconSymbol
                ios_icon_name="magnifyingglass"
                android_material_icon_name="search"
                size={20}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by city, deal type, date..."
                placeholderTextColor={colors.textSecondary}
                value={contractsSearchQuery}
                onChangeText={setContractsSearchQuery}
              />
              {contractsSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setContractsSearchQuery('')}>
                  <IconSymbol
                    ios_icon_name="xmark.circle.fill"
                    android_material_icon_name="cancel"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>

            {loadingContracts ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            ) : filteredContracts.length === 0 ? (
              <Text style={styles.noData}>No expiring contracts</Text>
            ) : (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderCell, styles.customerColumn]}>Customer Name</Text>
                      <Text style={[styles.tableHeaderCell, styles.cityColumn]}>City</Text>
                      <Text style={[styles.tableHeaderCell, styles.dealTypeColumn]}>Deal Type</Text>
                      <Text style={[styles.tableHeaderCell, styles.bpdColumn]}>BPD</Text>
                      <Text style={[styles.tableHeaderCell, styles.dateColumn]}>End Date</Text>
                    </View>
                    {getPaginatedContracts().map((item, index) => (
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
                        <Text style={[styles.tableCell, styles.dealTypeColumn]}>
                          {item.deal_type || '-'}
                        </Text>
                        <Text style={[styles.tableCell, styles.bpdColumn, styles.numberText]}>
                          {formatInteger(item.bpd)}
                        </Text>
                        <Text style={[styles.tableCell, styles.dateColumn]}>
                          {item.end_date || '-'}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                <View style={styles.pagination}>
                  <Text style={styles.paginationText}>
                    Showing {(contractsCurrentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                    {Math.min(contractsCurrentPage * ITEMS_PER_PAGE, filteredContracts.length)} of{' '}
                    {filteredContracts.length}
                  </Text>
                  <View style={styles.paginationButtons}>
                    <TouchableOpacity
                      style={[
                        styles.paginationButton,
                        contractsCurrentPage === 1 && styles.paginationButtonDisabled,
                      ]}
                      onPress={() => setContractsCurrentPage(contractsCurrentPage - 1)}
                      disabled={contractsCurrentPage === 1}
                    >
                      <Text style={styles.paginationButtonText}>Prev</Text>
                    </TouchableOpacity>
                    <Text style={styles.pageNumber}>
                      {contractsCurrentPage} / {contractsTotalPages}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.paginationButton,
                        contractsCurrentPage === contractsTotalPages && styles.paginationButtonDisabled,
                      ]}
                      onPress={() => setContractsCurrentPage(contractsCurrentPage + 1)}
                      disabled={contractsCurrentPage === contractsTotalPages}
                    >
                      <Text style={styles.paginationButtonText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol
                ios_icon_name="chart.pie.fill"
                android_material_icon_name="pie_chart"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.sectionTitle}>Customer Allocations</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Allocations for {selectedCustomer}
            </Text>

            <View style={styles.searchContainer}>
              <IconSymbol
                ios_icon_name="magnifyingglass"
                android_material_icon_name="search"
                size={20}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by location, product..."
                placeholderTextColor={colors.textSecondary}
                value={allocationsSearchQuery}
                onChangeText={setAllocationsSearchQuery}
              />
              {allocationsSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setAllocationsSearchQuery('')}>
                  <IconSymbol
                    ios_icon_name="xmark.circle.fill"
                    android_material_icon_name="cancel"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>

            {loadingAllocations ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            ) : filteredAllocations.length === 0 ? (
              <Text style={styles.noData}>No allocations to display</Text>
            ) : (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderCell, styles.customerColumn]}>Customer</Text>
                      <Text style={[styles.tableHeaderCell, styles.locationColumn]}>Location</Text>
                      <Text style={[styles.tableHeaderCell, styles.productColumn]}>Product</Text>
                      <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Remaining</Text>
                      <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Lifting %</Text>
                      <Text style={[styles.tableHeaderCell, styles.refreshColumn]}>Refresh</Text>
                      <Text style={[styles.tableHeaderCell, styles.typeColumn]}>Type</Text>
                    </View>
                    {getPaginatedAllocations().map((item, index) => (
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
                        <Text style={[styles.tableCell, styles.numberColumn, styles.numberText]}>
                          {formatInteger(item.remaining_amount)}
                        </Text>
                        <Text style={[styles.tableCell, styles.numberColumn, styles.numberText]}>
                          {item.lifting_percentage}%
                        </Text>
                        <Text style={[styles.tableCell, styles.refreshColumn]}>
                          {item.refresh_period || '-'}
                        </Text>
                        <Text style={[styles.tableCell, styles.typeColumn]}>
                          {item.lifting_number_type || '-'}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                <View style={styles.pagination}>
                  <Text style={styles.paginationText}>
                    Showing {(allocationsCurrentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                    {Math.min(allocationsCurrentPage * ITEMS_PER_PAGE, filteredAllocations.length)} of{' '}
                    {filteredAllocations.length}
                  </Text>
                  <View style={styles.paginationButtons}>
                    <TouchableOpacity
                      style={[
                        styles.paginationButton,
                        allocationsCurrentPage === 1 && styles.paginationButtonDisabled,
                      ]}
                      onPress={() => setAllocationsCurrentPage(allocationsCurrentPage - 1)}
                      disabled={allocationsCurrentPage === 1}
                    >
                      <Text style={styles.paginationButtonText}>Prev</Text>
                    </TouchableOpacity>
                    <Text style={styles.pageNumber}>
                      {allocationsCurrentPage} / {allocationsTotalPages}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.paginationButton,
                        allocationsCurrentPage === allocationsTotalPages && styles.paginationButtonDisabled,
                      ]}
                      onPress={() => setAllocationsCurrentPage(allocationsCurrentPage + 1)}
                      disabled={allocationsCurrentPage === allocationsTotalPages}
                    >
                      <Text style={styles.paginationButtonText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol
                ios_icon_name="bubble.left.and.bubble.right.fill"
                android_material_icon_name="comment"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.sectionTitle}>Customer Details</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Selected customer: {selectedCustomer}
            </Text>

            <View style={styles.commentForm}>
              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Dropdown
                    label="Subject"
                    placeholder="Select subject"
                    value={subject}
                    options={subjectOptions}
                    onValueChange={setSubject}
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Dropdown
                    label="Submission Type"
                    placeholder="Select type"
                    value={submissionType}
                    options={submissionTypeOptions}
                    onValueChange={setSubmissionType}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Write a comment</Text>
                <View style={styles.commentInputContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Share your thoughts..."
                    placeholderTextColor={colors.textSecondary}
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                    numberOfLines={4}
                  />
                  <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.iconButton} onPress={handlePickFile}>
                      <IconSymbol
                        ios_icon_name="paperclip"
                        android_material_icon_name="attach_file"
                        size={20}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                      <IconSymbol
                        ios_icon_name="face.smiling"
                        android_material_icon_name="emoji_emotions"
                        size={20}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {selectedFiles.length > 0 && (
                  <Text style={styles.fileCount}>{selectedFiles.length} file(s) selected</Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.submitButton, submittingComment && styles.submitButtonDisabled]}
                onPress={handleSubmitComment}
                disabled={submittingComment}
              >
                {submittingComment ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <React.Fragment>
                    <IconSymbol
                      ios_icon_name="paperplane.fill"
                      android_material_icon_name="send"
                      size={20}
                      color={colors.white}
                    />
                    <Text style={styles.submitButtonText}>Post Comment</Text>
                  </React.Fragment>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.commentsList}>
              {loadingComments ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : comments.length === 0 ? (
                <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
              ) : (
                comments.map((comment, index) => (
                  <View key={index} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <View style={styles.commentAvatar}>
                        <IconSymbol
                          ios_icon_name="person.circle.fill"
                          android_material_icon_name="account_circle"
                          size={40}
                          color={colors.primary}
                        />
                      </View>
                      <View style={styles.commentInfo}>
                        <Text style={styles.commentAuthor}>{getCommentAuthorName(comment)}</Text>
                        <Text style={styles.commentMeta}>
                          {comment.customer_name} • {comment.submission_type}
                        </Text>
                      </View>
                      <Text style={styles.commentTime}>{getTimeElapsed(comment.created_at)}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.body}</Text>
                    <View style={styles.commentActionsRow}>
                      <TouchableOpacity
                        style={styles.commentAction}
                        onPress={() => handleLikeComment(comment.id)}
                      >
                        <IconSymbol
                          ios_icon_name="hand.thumbsup"
                          android_material_icon_name="thumb_up"
                          size={18}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.commentActionText}>Like</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentAction}>
                        <IconSymbol
                          ios_icon_name="bubble.left"
                          android_material_icon_name="reply"
                          size={18}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.commentActionText}>Reply</Text>
                      </TouchableOpacity>
                      {comment.author === user?.id && (
                        <TouchableOpacity
                          style={styles.commentAction}
                          onPress={() => handleDeleteComment(comment.id)}
                        >
                          <IconSymbol
                            ios_icon_name="trash"
                            android_material_icon_name="delete"
                            size={18}
                            color={colors.secondary}
                          />
                          <Text style={[styles.commentActionText, { color: colors.secondary }]}>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <IconSymbol
            ios_icon_name="person.crop.circle.badge.questionmark"
            android_material_icon_name="person_search"
            size={80}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyStateTitle}>Select a Customer</Text>
          <Text style={styles.emptyStateText}>
            Choose a customer from the dropdown above to view their profile, economic data, contracts, and allocations.
          </Text>
        </View>
      )}
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
  },
  header: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
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
  customerSelector: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  section: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
    marginLeft: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    marginRight: 8,
  },
  loader: {
    marginVertical: 24,
  },
  noData: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    paddingVertical: 24,
  },
  table: {
    backgroundColor: colors.card,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    paddingHorizontal: 8,
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
    fontSize: 12,
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
  cityColumn: {
    width: 150,
  },
  dealTypeColumn: {
    width: 150,
  },
  bpdColumn: {
    width: 100,
  },
  dateColumn: {
    width: 120,
  },
  locationColumn: {
    width: 180,
  },
  refreshColumn: {
    width: 100,
  },
  typeColumn: {
    width: 150,
  },
  numberText: {
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  pagination: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  paginationText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  paginationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginHorizontal: 8,
  },
  paginationButtonDisabled: {
    opacity: 0.4,
  },
  paginationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  pageNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 8,
  },
  commentForm: {
    marginBottom: 24,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 0,
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
  commentInputContainer: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  commentInput: {
    fontSize: 14,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  fileCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  commentsList: {
    marginTop: 8,
  },
  noComments: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    paddingVertical: 24,
  },
  commentItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    marginRight: 12,
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  commentMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  commentTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActionsRow: {
    flexDirection: 'row',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentActionText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
