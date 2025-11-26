
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import Dropdown, { DropdownOption } from '@/components/Dropdown';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Comment } from '@/types/database.types';
import * as ImagePicker from 'expo-image-picker';

interface DashboardCard {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: string;
  androidIcon: string;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [subject, setSubject] = useState('Sales Request Comment');
  const [submissionType, setSubmissionType] = useState('General');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [customers, setCustomers] = useState<DropdownOption[]>([]);

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Economic Info',
      value: '$2.4M',
      subtitle: 'Monthly revenue',
      color: '#E3F2FD',
      icon: 'dollarsign.circle.fill',
      androidIcon: 'attach_money',
    },
    {
      title: 'Expiring Contracts',
      value: '23',
      subtitle: 'Contracts expiring soon',
      color: '#FFF3E0',
      icon: 'calendar.badge.exclamationmark',
      androidIcon: 'event_busy',
    },
    {
      title: 'Allocation',
      value: '89%',
      subtitle: 'Resource allocation',
      color: '#E8F5E9',
      icon: 'chart.pie.fill',
      androidIcon: 'pie_chart',
    },
    {
      title: 'Pending Deals',
      value: '47',
      subtitle: 'Deals in pipeline',
      color: '#F3E5F5',
      icon: 'briefcase.fill',
      androidIcon: 'work',
    },
  ];

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
    fetchComments();
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      console.log('Home: Fetching customers');
      const { data, error } = await supabase
        .from('comments')
        .select('customer_name')
        .not('customer_name', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Home: Error fetching customers', error);
        throw error;
      }

      const uniqueCustomers = Array.from(
        new Set(data?.map((item) => item.customer_name) || [])
      );

      const customerOptions: DropdownOption[] = uniqueCustomers.map((name) => ({
        label: name,
        value: name,
      }));

      console.log('Home: Customers fetched', customerOptions.length);
      setCustomers(customerOptions);
    } catch (error: any) {
      console.log('Home: Error fetching customers', error.message);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      console.log('Home: Fetching comments');
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.log('Home: Error fetching comments', error);
        throw error;
      }

      console.log('Home: Comments fetched', data?.length);
      setComments(data || []);
    } catch (error: any) {
      console.log('Home: Error', error.message);
      Alert.alert('Error', 'Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
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
        console.log('Home: Files selected', result.assets.length);
      }
    } catch (error) {
      console.log('Home: Error picking file', error);
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    const customerName = isNewCustomer ? newCustomerName : selectedCustomer;
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please select or enter a customer name');
      return;
    }

    try {
      setLoading(true);
      console.log('Home: Submitting comment');

      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            author: user?.id,
            customer_name: customerName,
            subject: subject,
            submission_type: submissionType,
            body: commentText,
          },
        ])
        .select()
        .single();

      if (error) {
        console.log('Home: Error submitting comment', error);
        throw error;
      }

      console.log('Home: Comment submitted', data.id);

      if (selectedFiles.length > 0) {
        console.log('Home: Uploading attachments', selectedFiles.length);
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
      setNewCustomerName('');
      setSelectedCustomer('');
      setSelectedFiles([]);
      setIsNewCustomer(false);
      fetchComments();
      fetchCustomers();
      Alert.alert('Success', 'Comment posted successfully');
    } catch (error: any) {
      console.log('Home: Error', error.message);
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      console.log('Home: Liking comment', commentId);
      const { error } = await supabase.from('reactions').insert([
        {
          comment_id: commentId,
          user_id: user?.id,
          type: 'like',
        },
      ]);

      if (error) throw error;
      console.log('Home: Comment liked');
    } catch (error: any) {
      console.log('Home: Error liking comment', error.message);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      console.log('Home: Deleting comment', commentId);
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      console.log('Home: Comment deleted');
      fetchComments();
    } catch (error: any) {
      console.log('Home: Error deleting comment', error.message);
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

  const handleCardPress = (cardTitle: string) => {
    console.log('Home: Card pressed', cardTitle);
    if (cardTitle === 'Economic Info') {
      router.push('/(app)/(drawer)/economic-summary');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.cardsGrid}>
        {dashboardCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: card.color }]}
            onPress={() => handleCardPress(card.title)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name={card.icon}
                android_material_icon_name={card.androidIcon}
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.cardValue}>{card.value}</Text>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.commentsSection}>
        <View style={styles.sectionHeader}>
          <IconSymbol
            ios_icon_name="bubble.left.and.bubble.right.fill"
            android_material_icon_name="comment"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.sectionTitle}>Recent Comments</Text>
        </View>

        <View style={styles.commentForm}>
          <View style={styles.formRow}>
            <View style={styles.toggleContainer}>
              <Text style={styles.label}>New Customer</Text>
              <TouchableOpacity
                style={[styles.toggle, isNewCustomer && styles.toggleActive]}
                onPress={() => setIsNewCustomer(!isNewCustomer)}
              >
                <View style={[styles.toggleThumb, isNewCustomer && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
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
              placeholder="Select a customer"
              value={selectedCustomer}
              options={customers}
              onValueChange={setSelectedCustomer}
            />
          )}

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
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmitComment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <IconSymbol
                  ios_icon_name="paperplane.fill"
                  android_material_icon_name="send"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.submitButtonText}>Post Comment</Text>
              </>
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
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  card: {
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  commentsSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  commentForm: {
    marginBottom: 24,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 0,
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
});
