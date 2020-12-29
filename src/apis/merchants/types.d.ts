interface MerchantSignupParams {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface MerchantSignupResponse {
  merchant: {
    createdAt: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
  };
  session: { token: string; mfaVerified: boolean };
}

// interface MerchantSignupE
