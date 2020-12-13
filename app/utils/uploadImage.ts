interface File {
  uri: string;
}

export async function uploadImage(file: File, signedRequest: string) {
  function getFileType() {
    if (file.uri.includes('jpg')) {
      return 'image/jpeg'
    } else return 'video/mp4'
  }
  try {
    await fetch(signedRequest, {
      method: "PUT",
      body: file,
      headers: {
        'Content-type': 'image/jpeg'
      }
    })

    return 'upload successful'
  } catch (error) {
    console.log("uploadImage -> error", error)
  }
}
