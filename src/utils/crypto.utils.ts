import {StoreService} from "../services/vault/store.service";
import {StoreKeys} from "../shared/const/vault/store.keys";
import {CryptoAesGcmService} from "../services/crypto/crypto-aes-gcm.service";

export async function DecryptValue(value: string, iv: string = ''){
    const key = await StoreService.get(StoreKeys.MASTER_PASSWORD);
    if (!key) {
        throw new Error('Master password not found in storage');
    }
    return await CryptoAesGcmService.decrypt(value, key, iv);
}