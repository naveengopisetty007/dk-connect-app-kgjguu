
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

function CustomDrawerContent(props: any) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    console.log('Drawer: Signing out');
    await signOut();
    router.replace('/login');
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.logoContainer}>
          <IconSymbol
            ios_icon_name="building.2.fill"
            android_material_icon_name="business"
            size={40}
            color={colors.white}
          />
        </View>
        <Text style={styles.appTitle}>DK Connect</Text>
      </View>

      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.drawerFooter}>
        <View style={styles.userInfo}>
          <IconSymbol
            ios_icon_name="person.circle.fill"
            android_material_icon_name="account_circle"
            size={24}
            color={colors.white}
          />
          <Text style={styles.userName} numberOfLines={1}>
            {user?.email || 'User'}
          </Text>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <IconSymbol
            ios_icon_name="arrow.right.square.fill"
            android_material_icon_name="logout"
            size={20}
            color={colors.white}
          />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
        drawerStyle: {
          backgroundColor: colors.primary,
          width: 280,
        },
        drawerActiveTintColor: colors.primary,
        drawerActiveBackgroundColor: colors.white,
        drawerInactiveTintColor: colors.white,
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
      }}
    >
      <Drawer.Screen
        name="(home)"
        options={{
          drawerLabel: 'Home',
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <IconSymbol
              ios_icon_name="house.fill"
              android_material_icon_name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="customer-profile"
        options={{
          drawerLabel: 'Customer Profile',
          title: 'Customer Profile',
          drawerIcon: ({ color, size }) => (
            <IconSymbol
              ios_icon_name="person.2.fill"
              android_material_icon_name="people"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="deal-analysis"
        options={{
          drawerLabel: 'Deal Analysis',
          title: 'Deal Analysis',
          drawerIcon: ({ color, size }) => (
            <IconSymbol
              ios_icon_name="chart.bar.fill"
              android_material_icon_name="bar_chart"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="deal-submission"
        options={{
          drawerLabel: 'Deal Submission',
          title: 'Deal Submission',
          drawerIcon: ({ color, size }) => (
            <IconSymbol
              ios_icon_name="doc.text.fill"
              android_material_icon_name="description"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="leads"
        options={{
          drawerLabel: 'Leads',
          title: 'Leads',
          drawerIcon: ({ color, size }) => (
            <IconSymbol
              ios_icon_name="target"
              android_material_icon_name="track_changes"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="economic-summary"
        options={{
          drawerLabel: () => null,
          title: 'Economic Summary',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 10,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  drawerItems: {
    flex: 1,
    paddingTop: 10,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  userName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  signOutText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
