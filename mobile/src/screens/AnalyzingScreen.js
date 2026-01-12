import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { analyzeFace } from '../services/api';

export default function AnalyzingScreen({ route, navigation }) {
  const { imageUri } = route.params;

  useEffect(() => {
    analyzeImage();
  }, []);

  const analyzeImage = async () => {
    try {
      const result = await analyzeFace(imageUri);
      
      if (result.success) {
        navigation.replace('Results', {
          analysis: result.analysis,
          recommendations: result.recommendations,
        });
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert(
        'Analysis Error',
        error.response?.data?.error || 'Failed to analyze image. Please try again.',
        [
          {
            text: 'Go Back',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Retry',
            onPress: analyzeImage,
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={styles.text}>Analyzing...</Text>
        <Text style={styles.subtext}>Please wait while we analyze your photo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});


