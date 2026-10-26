import { StorageService } from './storageService';

/**
 * Lightweight i18n helper. Returns the provided fallback when a translation
 * key is not yet available for the active language.
 */
export class I18nService {
  public static t(key: string, fallback: string): string {
    void key;
    void StorageService.getLanguage();
    return fallback;
  }
}
