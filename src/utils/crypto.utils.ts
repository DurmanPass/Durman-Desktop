import {StoreService} from "../services/vault/store.service";
import {StoreKeys} from "../shared/const/vault/store.keys";
import {CryptoAesGcmService} from "../services/crypto/crypto-aes-gcm.service";

export async function DecryptValue(value: string | null, iv: string | null = ''){
    const key = await StoreService.get(StoreKeys.MASTER_PASSWORD);
    if (!key) {
        throw new Error('Master password not found in storage');
    }
    return await CryptoAesGcmService.decrypt(value ? value : '', key, iv ? iv : '');
}

export async function EncryptValue(value: string | null, iv: string | null = ''){
    const key = await StoreService.get(StoreKeys.MASTER_PASSWORD);
    if (!key) {
        throw new Error('Master password not found in storage');
    }
    return await CryptoAesGcmService.encrypt(value ? value : '', key, iv ? iv : '');
}