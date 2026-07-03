export const bankTransferInfo = {
  bankName: process.env.NEXT_PUBLIC_BANK_NAME ?? '입금 은행 미설정',
  accountNo: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NO ?? 'NEXT_PUBLIC_BANK_ACCOUNT_NO 설정 필요',
  accountHolder: process.env.NEXT_PUBLIC_BANK_ACCOUNT_HOLDER ?? 'JHS Computer',
};

export function isBankTransferConfigured() {
  return !bankTransferInfo.accountNo.includes('설정 필요') && !bankTransferInfo.bankName.includes('미설정');
}
