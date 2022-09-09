import { isEmpty } from "./ObjectUtil";
import { getUuid } from "./UuidUtil";
import { MMKV } from "react-native-mmkv";


const storage = new MMKV();

export function getUserId() {
  let userId = storage.getString("userId");
  if (userId) {
    return userId;
  } else {
    let uuid = storage.getString("uuid");
    if (isEmpty(uuid)) {
      uuid = getUuid();
      storage.set("uuid", uuid);
    }
    return uuid;
  }
}
