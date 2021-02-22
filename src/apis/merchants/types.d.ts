interface MerchantSignupParams {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
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
}

interface Session {
  token: string;
  mfaVerified: boolean;
}
// interface MerchantSignupE
