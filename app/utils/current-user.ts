import { loadString } from "./storage"
import jwtDecode from 'jwt-decode'

export async function currentUser() {
  const token = await loadString("@authToken")

  const decoded = jwtDecode(token)

  return decoded
}
