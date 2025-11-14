// Open Bank Project API Types

export interface OBPConfig {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
  directLoginEndpoint: string;
}

export interface DirectLoginCredentials {
  username: string;
  password: string;
  consumerKey: string;
}

export interface DirectLoginResponse {
  token: string;
}

export interface OBPAccount {
  id: string;
  bank_id: string;
  label: string;
  number: string;
  owners: OBPUser[];
  type: string;
  balance: {
    currency: string;
    amount: string;
  };
  IBAN?: string;
  swift_bic?: string;
  views_available?: OBPView[];
}

export interface OBPUser {
  id: string;
  provider: string;
  display_name: string;
}

export interface OBPView {
  id: string;
  short_name: string;
  is_public: boolean;
}

export interface OBPTransaction {
  id: string;
  this_account: {
    id: string;
    bank_routing: {
      scheme: string;
      address: string;
    };
    account_routings: Array<{
      scheme: string;
      address: string;
    }>;
  };
  other_account: {
    id: string;
    holder: {
      name: string;
    };
    number: string;
    kind: string;
    IBAN?: string;
    swift_bic?: string;
    bank_routing: {
      scheme: string;
      address: string;
    };
  };
  details: {
    type: string;
    description: string;
    posted: string;
    completed: string;
    new_balance: {
      currency: string;
      amount: string;
    };
    value: {
      currency: string;
      amount: string;
    };
  };
  metadata?: {
    narrative?: string;
    comments?: Array<unknown>;
    tags?: Array<unknown>;
    images?: Array<unknown>;
    where?: unknown;
  };
}

export interface OBPTransactionRequest {
  value: {
    currency: string;
    amount: string;
  };
  description: string;
}

export interface OBPBank {
  id: string;
  short_name: string;
  full_name: string;
  logo: string;
  website: string;
}

export interface OBPError {
  error: string;
  message?: string;
}

export interface OBPAccountsResponse {
  accounts: OBPAccount[];
}

export interface OBPTransactionsResponse {
  transactions: OBPTransaction[];
}
