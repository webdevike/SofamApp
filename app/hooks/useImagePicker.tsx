import { useState, useEffect } from 'react'
import { Alert, Platform } from 'react-native'
import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export function useImagePicker() {
  const [hasCameraPermission, setCameraPermission] = useState(null)
  const [hasCameraRollPermission, setCameraRollPermission] = useState(null)
  const [media, setMedia] = useState(null)

  useEffect(() => {
    (async () => {
      const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA)
      const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      setCameraPermission(cameraPerm)
      setCameraRollPermission(cameraRollPerm)
    })()
  }, [media])

  async function pickImage() {
    if (hasCameraRollPermission) {
      const media = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
        videoExportPreset: 2
      })

      if (!media.cancelled) {
        setMedia(media)
      }
    }
  }

  async function takePicture(ref) {
    if (hasCameraPermission === 'granted' && hasCameraRollPermission === 'granted') {
      const photo = await ref.current.takePictureAsync({
        quality: 0.1,
      })
      setMedia(photo)
    }
  }

  return [media, pickImage, takePicture]
}
