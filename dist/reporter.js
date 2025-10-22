import chalk from 'chalk';
export class Reporter {
    static printResults(result) {
        console.log('\n' + chalk.bold.cyan('═══════════════════════════════════════════════════════'));
        console.log(chalk.bold.cyan('           🎃 PATTERN GHOUL CHECKER REPORT            '));
        console.log(chalk.bold.cyan('═══════════════════════════════════════════════════════\n'));
        // Issues
        if (result.issues.length > 0) {
            console.log(chalk.bold.red('❌ ISSUES FOUND:\n'));
            const issuesByFile = new Map();
            result.issues.forEach(issue => {
                if (!issuesByFile.has(issue.file)) {
                    issuesByFile.set(issue.file, []);
                }
                issuesByFile.get(issue.file).push(issue);
            });
            issuesByFile.forEach((issues, file) => {
                console.log(chalk.bold.underline(file));
                issues.forEach(issue => {
                    console.log(`   ${chalk.red('✗')} Line ${chalk.yellow(issue.line)}:${chalk.yellow(issue.column)}`);
                    console.log(`     Key: ${chalk.cyan(issue.key)}`);
                    console.log(`     Issue: ${chalk.red(issue.issue)}\n`);
                });
            });
        }
        else {
            console.log(chalk.bold.green('✨ No issues found! All translations have Arabic default values.\n'));
        }
        console.log(chalk.bold.cyan('═══════════════════════════════════════════════════════\n'));
        // Summary
        console.log(chalk.bold('📊 SUMMARY:'));
        console.log(`   Files Checked: ${chalk.yellow(result.totalFiles)}`);
        console.log(`   Files with Issues: ${chalk.red(result.filesWithIssues)}`);
        console.log(`   Total Translations: ${chalk.yellow(result.totalTranslations)}`);
        console.log(`   ${chalk.green('✓')} Passed: ${chalk.green(result.successCount)}`);
        console.log(`   ${chalk.red('✗')} Failed: ${chalk.red(result.failCount)}\n`);
        // Progress bar
        const total = result.totalTranslations;
        const successRate = total > 0 ? (result.successCount / total) * 100 : 0;
        const barLength = 40;
        const filledLength = Math.round((successRate / 100) * barLength);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        const barColor = successRate >= 80 ? chalk.green : successRate >= 50 ? chalk.yellow : chalk.red;
        console.log(`   Success Rate: ${barColor(bar)} ${successRate.toFixed(1)}%\n`);
        // Exit with error code if issues found
        if (result.failCount > 0) {
            process.exit(1);
        }
    }
}
