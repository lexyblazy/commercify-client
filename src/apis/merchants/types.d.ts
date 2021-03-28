interface MerchantSignupParams {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  storeName: string;
}

interface MerchantSignupResponse {
  merchant: Merchant;
  session: Session;
}

interface Merchant {
  createdAt: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  storeName: string;
  storeNameSlug: string;
}

interface Session {
  token: string;
  mfaVerified: boolean;
}
// interface MerchantSignupE
