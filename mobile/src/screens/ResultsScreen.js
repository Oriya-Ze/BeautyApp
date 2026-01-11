import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function ResultsScreen({ route }) {
  const { analysis, recommendations } = route.params;
  const [activeTab, setActiveTab] = useState('skincare');
  const [webViewUrl, setWebViewUrl] = useState(null);

  const openWebView = (url) => {
    setWebViewUrl(url);
  };

  const closeWebView = () => {
    setWebViewUrl(null);
  };

  const openInBrowser = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  if (webViewUrl) {
    return (
      <View style={styles.webViewContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={closeWebView}>
          <Text style={styles.closeButtonText}>✕ Close</Text>
        </TouchableOpacity>
        <WebView source={{ uri: webViewUrl }} style={styles.webView} />
      </View>
    );
  }

  const renderSkincare = () => (
    <ScrollView style={styles.tabContent}>
      <RecommendationCard
        title="Cleanser"
        description={recommendations.skincare.cleanser.type}
        detail={recommendations.skincare.cleanser.description}
        url={recommendations.skincare.cleanser.url}
        onPress={() => openInBrowser(recommendations.skincare.cleanser.url)}
      />
      <RecommendationCard
        title="Serum"
        description={recommendations.skincare.serum.type}
        detail={recommendations.skincare.serum.description}
        url={recommendations.skincare.serum.url}
        onPress={() => openInBrowser(recommendations.skincare.serum.url)}
      />
      <RecommendationCard
        title="Moisturizer"
        description={recommendations.skincare.moisturizer.type}
        detail={recommendations.skincare.moisturizer.description}
        url={recommendations.skincare.moisturizer.url}
        onPress={() => openInBrowser(recommendations.skincare.moisturizer.url)}
      />
      <RecommendationCard
        title="SPF"
        description={recommendations.skincare.spf.type}
        detail={recommendations.skincare.spf.description}
        url={recommendations.skincare.spf.url}
        onPress={() => openInBrowser(recommendations.skincare.spf.url)}
      />
    </ScrollView>
  );

  const renderMakeup = () => (
    <ScrollView style={styles.tabContent}>
      <RecommendationCard
        title="Foundation"
        description={recommendations.makeup.foundation.type}
        detail={recommendations.makeup.foundation.description}
        url={recommendations.makeup.foundation.url}
        onPress={() => openInBrowser(recommendations.makeup.foundation.url)}
      />
      <RecommendationCard
        title="Blush Shades"
        description={recommendations.makeup.blush.shades.join(', ')}
        detail={recommendations.makeup.blush.description}
        url={recommendations.makeup.blush.url}
        onPress={() => openInBrowser(recommendations.makeup.blush.url)}
      />
      <RecommendationCard
        title="Lipstick Shades"
        description={recommendations.makeup.lipstick.shades.join(', ')}
        detail={recommendations.makeup.lipstick.description}
        url={recommendations.makeup.lipstick.url}
        onPress={() => openInBrowser(recommendations.makeup.lipstick.url)}
      />
      <RecommendationCard
        title="Eye Makeup"
        description={recommendations.makeup.eyeMakeup.style}
        detail={recommendations.makeup.eyeMakeup.description}
        url={recommendations.makeup.eyeMakeup.url}
        onPress={() => openInBrowser(recommendations.makeup.eyeMakeup.url)}
      />
    </ScrollView>
  );

  const renderOutfits = () => (
    <ScrollView style={styles.tabContent}>
      <RecommendationCard
        title={recommendations.outfits.outfit1.style}
        description={recommendations.outfits.outfit1.description}
        detail={`Colors: ${recommendations.outfits.outfit1.colors.join(', ')}`}
        url={recommendations.outfits.outfit1.url}
        onPress={() => openInBrowser(recommendations.outfits.outfit1.url)}
      />
      <RecommendationCard
        title={recommendations.outfits.outfit2.style}
        description={recommendations.outfits.outfit2.description}
        detail={`Colors: ${recommendations.outfits.outfit2.colors.join(', ')}`}
        url={recommendations.outfits.outfit2.url}
        onPress={() => openInBrowser(recommendations.outfits.outfit2.url)}
      />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Personalized Guide</Text>
        <View style={styles.analysisInfo}>
          <Text style={styles.analysisText}>
            Skin: {analysis.skinType} | Tone: {analysis.skinTone} | Undertone: {analysis.undertone}
          </Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'skincare' && styles.activeTab]}
          onPress={() => setActiveTab('skincare')}
        >
          <Text style={[styles.tabText, activeTab === 'skincare' && styles.activeTabText]}>
            Skincare
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'makeup' && styles.activeTab]}
          onPress={() => setActiveTab('makeup')}
        >
          <Text style={[styles.tabText, activeTab === 'makeup' && styles.activeTabText]}>
            Makeup
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'outfits' && styles.activeTab]}
          onPress={() => setActiveTab('outfits')}
        >
          <Text style={[styles.tabText, activeTab === 'outfits' && styles.activeTabText]}>
            Outfits
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'skincare' && renderSkincare()}
      {activeTab === 'makeup' && renderMakeup()}
      {activeTab === 'outfits' && renderOutfits()}
    </View>
  );
}

const RecommendationCard = ({ title, description, detail, url, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    {detail && <Text style={styles.cardDetail}>{detail}</Text>}
    <Text style={styles.cardLink}>Tap to view →</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  analysisInfo: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
  },
  analysisText: {
    fontSize: 14,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF6B9D',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  cardDetail: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  cardLink: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  webViewContainer: {
    flex: 1,
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  webView: {
    flex: 1,
  },
});

