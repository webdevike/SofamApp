import { loadString } from "./storage"

export default async () => {
  const token = await loadString("@authToken")

  return !!token
}
