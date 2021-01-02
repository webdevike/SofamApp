interface File {
  uri: string;
}

export async function uploadImage(file: File, signedRequest: string) {
  try {
    await fetch(signedRequest, {
      method: "PUT",
      body: file,
    })

    return 'upload successful'
  } catch (error) {
    console.log(error)
  }
}
