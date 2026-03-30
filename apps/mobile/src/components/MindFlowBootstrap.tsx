import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

interface MindFlowBootstrapProps {
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export function MindFlowBootstrap({ safeAreaInsets }: MindFlowBootstrapProps) {
  return (
    <SafeAreaView style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.content}>
        <Text style={styles.title}>MindFlow</Text>
        <Text style={styles.subtitle}>Your personal project planning companion</Text>
        <View style={styles.spacer} />
        <Text style={styles.version}>Version 0.0.1</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#F0F6FC',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B949E',
    textAlign: 'center',
    lineHeight: 24,
  },
  spacer: {
    flex: 1,
  },
  version: {
    fontSize: 12,
    color: '#484F58',
    marginBottom: 24,
  },
});
