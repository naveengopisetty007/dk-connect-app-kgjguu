
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function LeadsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.placeholderContainer}>
        <IconSymbol
          ios_icon_name="target"
          android_material_icon_name="track_changes"
          size={80}
          color={colors.primary}
        />
        <Text style={styles.title}>Leads</Text>
        <Text style={styles.subtitle}>
          Manage and track leads, convert prospects to customers, and monitor lead pipeline.
        </Text>
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
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});
