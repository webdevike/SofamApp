import { Alert } from "react-native"

interface File {
  uri: string;
}

// function getFileType() {
//   if (file.uri.includes('jpg')) {
//     return 'image/jpeg'
//   } else return 'video/mp4'
// }
export async function uploadImage(file: File, signedRequest: string) {
  try {
    await fetch(signedRequest, {
      method: "PUT",
      body: file,
      headers: {
        'Content-type': 'multipart/form-data'
      }
    })
    console.log('upload successful')

    return 'upload successful'
  } catch (error) {
    Alert.alert(error)
  }
}
