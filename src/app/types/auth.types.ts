export interface User {
  agreeToTerms: boolean;
  currentLocation: string;
  desiredLocations?: string;
  email: string;
  experienceLevel: string;
  fullName: string;
  jobType: string;
  needsVisaSponsorship: boolean;
  otherProfession?: string;
  password: string;
  profession?: string;
  remoteWork: string;
  salaryExpectation?: string;
  skills?: string;
  activationKey?: string;
  accountActivated?: boolean;
  passwordResetKey?: string;
  passwordResetExpires?: Date;
}

export interface JwtPayload {
  exp: number;
  _id: string;
  fullname: string;
  email: string;
  profession?: string;
}

export interface CreateAccountResponse {
  userId: string;
  message: string;
}

export interface LoginInfo {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}
