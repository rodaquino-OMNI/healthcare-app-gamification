import React, { useState, useEffect, useRef } from 'react'; // React v18.0+
import {
  Camera,
  useCameraPermission,
} from 'react-native-vision-camera'; // react-native-vision-camera v3.0+
import { PermissionsAndroid as Permissions, Platform, View, Image, StyleSheet } from 'react-native'; // react-native v0.71+
import { Button, ButtonProps } from '@design-system/components/Button/Button';
import { LoadingIndicator } from '@components/shared/LoadingIndicator';
import { checkAndroidPermissions } from '@utils/index';

/**
 * PhotoCapture Component:
 * A component that allows users to capture photos using the device's camera.
 * It handles permission requests, camera access, and displays a preview of the captured image.
 */
interface PhotoCaptureProps {
  /**
   * Callback function to handle the captured photo data.
   * @param imageUri - The URI of the captured image.
   */
  onCapture: (imageUri: string) => void;
}

/**
 * PhotoCapture Component:
 * A component that allows users to capture photos using the device's camera.
 * It handles permission requests, camera access, and displays a preview of the captured image.
 */
export const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onCapture }) => {
  // State variables
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const camera = useRef<Camera>(null);

  // Request camera permissions
  const { hasPermission: cameraPermissionStatus, requestPermission: requestCameraPermission } = useCameraPermission();

  /**
   * useEffect hook to handle camera permissions and initialization.
   */
  useEffect(() => {
    // Asynchronous function to check and request camera permissions
    const checkPermissions = async () => {
      // Check camera permissions based on the platform
      let permissionGranted = false;

      if (Platform.OS === 'android') {
        // Check and request camera permissions on Android
        permissionGranted = await checkAndroidPermissions();
      } else {
        // Check camera permissions on iOS using vision-camera hook
        permissionGranted = !!cameraPermissionStatus;
      }

      // Request camera permissions if they are not granted
      if (!permissionGranted && !cameraPermissionStatus) {
        const requestResult = await requestCameraPermission();
        permissionGranted = requestResult;
      }

      // Set the camera permission status
      setHasCameraPermission(permissionGranted);
      setIsCameraInitialized(true);
    };

    // Call the checkPermissions function
    checkPermissions();
  }, [cameraPermissionStatus, requestCameraPermission]);

  /**
   * Handles the photo capture process.
   */
  const capturePhoto = async () => {
    // Check if the camera reference is available
    if (camera.current && hasCameraPermission) {
      try {
        // Capture the photo using the camera
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'speed',
          flash: 'off',
        });

        // Set the captured image URI
        setCapturedImage(`file://${photo.path}`);
        onCapture(`file://${photo.path}`);
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    }
  };

  // Render loading indicator while camera is initializing
  if (!isCameraInitialized) {
    return <LoadingIndicator label="Initializing Camera..." />;
  }

  // Render permission request UI if camera permission is not granted
  if (!hasCameraPermission) {
    return (
      <View style={styles.container}>
        <Button onPress={() => requestCameraPermission()} accessibilityLabel="Request Camera Permission">
          Request Camera Permission
        </Button>
      </View>
    );
  }

  // Render the camera preview and capture button
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={(Camera as any).getAvailableCameraDevices?.()[0]}
        isActive={hasCameraPermission}
        ref={camera}
        photo={true}
      />
      {capturedImage && (
        <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
      )}
      <View style={styles.buttonContainer}>
        <Button onPress={capturePhoto} style={styles.captureButton} accessibilityLabel="Capture Photo">
          Capture Photo
        </Button>
      </View>
    </View>
  );
};

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 15,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
  },
});