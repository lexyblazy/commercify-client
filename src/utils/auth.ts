const MERCHANT_LABEL = "MERCHANT";
const SESSION_LABEL = "SESSION";

export const isAuthenticated = () => {
  const merchant = JSON.parse(localStorage.getItem(MERCHANT_LABEL)!);
  const session = JSON.parse(localStorage.getItem(SESSION_LABEL)!);

  if (merchant && session) {
    return true;
  }

  return false;
};

export const save = (params: MerchantSignupResponse) => {
  const { merchant, session } = params;

  localStorage.setItem(MERCHANT_LABEL, JSON.stringify(merchant));
  localStorage.setItem(SESSION_LABEL, JSON.stringify(session));
};

export const getToken = () => {
  const session: Session | null = JSON.parse(
    localStorage.getItem(SESSION_LABEL)!
  );

  return session?.token;
};

export const getMerchant = () => {
  const merchant: Merchant | null = JSON.parse(
    localStorage.getItem(MERCHANT_LABEL)!
  );

  return merchant;
};

export const logout = () => {
  localStorage.removeItem(MERCHANT_LABEL);
  localStorage.removeItem(SESSION_LABEL);
};
