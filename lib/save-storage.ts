export const SAVE_KEY = "tcg-faerie-v1";
export const VALID_BACKUP_KEY = `${SAVE_KEY}-last-valid`;
export const REPLACEMENT_BACKUP_KEY = `${SAVE_KEY}-before-replacement`;
export const CORRUPT_BACKUP_KEY = `${SAVE_KEY}-unreadable`;
export const SAVE_BACKUP_KEYS = [VALID_BACKUP_KEY, REPLACEMENT_BACKUP_KEY, `${SAVE_KEY}-backup`,`${SAVE_KEY}-backup-v2`,`${SAVE_KEY}-backup-v3`,`${SAVE_KEY}-backup-v4-before-phase7`,`${SAVE_KEY}-backup-v4-before-phase8`] as const;
