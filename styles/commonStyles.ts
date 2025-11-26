
import { StyleSheet } from 'react-native';

export const colors = {
  background: '#F5F5F5',
  text: '#333333',
  textSecondary: '#666666',
  primary: '#3498db',
  secondary: '#e74c3c',
  accent: '#f39c12',
  card: '#FFFFFF',
  highlight: '#3498db',
  border: '#E0E0E0',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c',
  white: '#FFFFFF',
  black: '#000000',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  textSecondary: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.text,
  },
});
