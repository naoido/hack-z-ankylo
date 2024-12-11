export interface JwtPayload {
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: number;
    iat?: number;
    email?: string;
    phone?: string;
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
    role?: string;
    aal?: string;
    amr?: AuthenticationMethodReference[];
    session_id?: string;
    is_anonymous?: boolean;
  }
  
  export interface AuthenticationMethodReference {
    method?: string;
    timestamp?: number;
  }