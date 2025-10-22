import type { CheckResult } from './types.js';
export declare class TranslationChecker {
    private issues;
    private successCount;
    private failCount;
    private totalTranslations;
    private filesChecked;
    checkProject(projectPath?: string): Promise<CheckResult>;
    private checkFile;
    private hasUseTranslation;
    private checkLineForTranslations;
}
