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
    const data = await fetch(signedRequest, {
      method: "PUT",
      body: file,
      headers: {
        'Content-type': getFileType()
      }
    })
    console.log("uploadImage -> data", data)
  } catch (error) {
    console.log("uploadImage -> error", error)
  }
}
