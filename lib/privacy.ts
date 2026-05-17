export function initialsName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return `${parts[0][0] ?? ""}.`;
  }
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

export function maskPhone(phone: string) {
  const clean = phone.replace(/\s+/g, "");
  if (clean.length <= 4) {
    return "****";
  }
  return `${clean.slice(0, 4)}****${clean.slice(-2)}`;
}

export function maskNationalId(nationalId: string) {
  if (nationalId.length <= 4) {
    return "****";
  }
  return `************${nationalId.slice(-4)}`;
}
