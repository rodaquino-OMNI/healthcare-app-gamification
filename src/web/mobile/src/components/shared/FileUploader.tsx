import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Platform, 
  Alert 
} from 'react-native';
import { launchCameraAsync, launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'; // v14.0+
import { useNavigation } from '@react-navigation/native'; // v6.0+
import { checkAndroidPermissions } from '@utils/permissions';
import { LoadingIndicator } from '@components/shared';

interface FileUploaderProps {
  label: string;
  onFileSelected: (uri: string) => void;
  journey: 'health' | 'care' | 'plan';
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  onFileSelected,
  journey,
}) => {
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();

  // Handle camera capture
  const handleCameraCapture = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check permissions on Android
      if (Platform.OS === 'android') {
        const hasPermission = await checkAndroidPermissions();
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Camera permission is needed to capture images.',
            [{ text: 'OK' }]
          );
          setLoading(false);
          return;
        }
      }

      const result = await launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      setLoading(false);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setFileUri(selectedAsset.uri);
        onFileSelected(selectedAsset.uri);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
      console.error('Camera capture error:', error);
    }
  }, [onFileSelected]);

  // Handle file selection
  const handleFileSelect = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check permissions on Android
      if (Platform.OS === 'android') {
        const hasPermission = await checkAndroidPermissions();
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Storage permission is needed to select files.',
            [{ text: 'OK' }]
          );
          setLoading(false);
          return;
        }
      }

      const result = await launchImageLibraryAsync({
        allowsEditing: false,
        mediaTypes: MediaTypeOptions.All,
        quality: 0.8,
      });

      setLoading(false);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setFileUri(selectedAsset.uri);
        onFileSelected(selectedAsset.uri);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to select file. Please try again.');
      console.error('File selection error:', error);
    }
  }, [onFileSelected]);

  // Get journey-specific color
  const getJourneyColor = () => {
    switch (journey) {
      case 'health':
        return '#0ACF83'; // Green
      case 'care':
        return '#FF8C42'; // Orange
      case 'plan':
        return '#3A86FF'; // Blue
      default:
        return '#0066CC'; // Default brand color
    }
  };

  // Determine if the file is an image based on its URI
  const isImageFile = (uri: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(uri.toLowerCase());
  };

  // Extract filename from URI
  const getFileName = (uri: string) => {
    return uri.split('/').pop() || 'File';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <LoadingIndicator />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        ) : fileUri ? (
          <View style={styles.previewContainer}>
            {isImageFile(fileUri) ? (
              <Image 
                source={{ uri: fileUri }} 
                style={styles.previewImage} 
                accessibilityLabel="Selected image preview"
              />
            ) : (
              <View style={styles.filePreview}>
                <Text style={styles.fileIcon}>📄</Text>
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                  {getFileName(fileUri)}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.removeButton, { backgroundColor: getJourneyColor() }]}
              onPress={() => {
                setFileUri(null);
                onFileSelected('');
              }}
              accessibilityLabel="Remove file"
              accessibilityHint="Removes the currently selected file"
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: getJourneyColor() }]}
              onPress={handleCameraCapture}
              disabled={loading}
              accessibilityLabel="Take photo"
              accessibilityHint="Opens camera to take a photo"
            >
              <Text style={styles.buttonText}>📷 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: getJourneyColor() }]}
              onPress={handleFileSelect}
              disabled={loading}
              accessibilityLabel="Select file"
              accessibilityHint="Opens file picker to select a file"
            >
              <Text style={styles.buttonText}>📁 Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333333',
  },
  contentContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
    minHeight: 120,
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  loadingText: {
    marginTop: 10,
    color: '#666666',
    fontSize: 14,
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    minHeight: 120,
    maxHeight: 200,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'contain',
  },
  filePreview: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  },
  fileIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  fileName: {
    fontSize: 14,
    color: '#333333',
    maxWidth: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FileUploader;