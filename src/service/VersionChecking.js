import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, processResponse } from "../config";

export default async function VersionChecking({ current, minimum }) {
  const c = current.split('.').map(Number);
  const m = minimum.split('.').map(Number);

  for (let i = 0; i < m.length; i++) {
    if ((c[i] || 0) < m[i]) return true;
    if ((c[i] || 0) > m[i]) return false;
  }
  
  return false;
}
