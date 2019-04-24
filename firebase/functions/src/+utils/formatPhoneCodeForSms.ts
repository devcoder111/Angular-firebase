export function formatPhoneCodeForSms(phone: string): string {
  return phone.startsWith('+65') ? phone : '+65' + phone;
}
