import { UserType } from 'src/interfaces/user.interface';

export interface UserIntialStateType {
	user: UserType | null;
	isLoading: boolean;
	error: string | null | unknown;
	recaptchaToken?: string | null;
}

export interface AuthTokens {
	refreshToken: string;
	accessToken: string;
}

export interface AuthUserResponse extends AuthTokens {
	user: UserType;
}

export interface InterfaceEmailAndPassword {
	password: string;
	email: string;
	recaptchaToken?: string;
}

export interface InterfaceEmailAndOtp {
	email: string;
	otpVerification: string;
}

export interface InterfaceSign {
	password: string;
	email: string;
	callback?: () => void;
}
