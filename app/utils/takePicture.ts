import { Permissions } from "expo"

export const takePicture = async (ref) => {
  const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA)

  const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
  try {
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      const photo = await ref.current.takePictureAsync({
        quality: 0.1,
      })

      return photo
    }
  } catch (error) {
    return error
  }
}
