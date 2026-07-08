import { z } from 'zod';

// Calculate age from date of birth
function calculateAge(dob: string): number {
	const today = new Date();
	const birthDate = new Date(dob);
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

// Password regex patterns
const hasUppercase = /[A-Z]/;
const hasLowercase = /[a-z]/;
const hasNumber = /\d/;
const hasSpecialChar = /[@$!%*?&#]/;

// Step 1: Personal Info + Plan Selection
export const schemaStep1 = z
	.object({
		firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
		lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
		email: z.email('Please enter a valid email address').transform((v) => v.toLowerCase()),
		phone: z
			.string()
			.regex(/^\d{10}$/, 'Phone number must be 10 digits'),
		dob: z
			.string()
			.min(1, 'Date of birth is required')
			.refine((val) => calculateAge(val) >= 18, 'You must be at least 18 years old'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.refine((val) => hasUppercase.test(val), 'Password must contain an uppercase letter')
			.refine((val) => hasLowercase.test(val), 'Password must contain a lowercase letter')
			.refine((val) => hasNumber.test(val), 'Password must contain a number')
			.refine((val) => hasSpecialChar.test(val), 'Password must contain a special character (@$!%*?&#)'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
		selectedPlan: z.string().min(1, 'Please select a membership plan'),
		agreedToTerms: z.literal(true, {
			message: 'You must agree to the Terms of Service',
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

// Step 2: Waiver Signing
export const schemaStep2 = schemaStep1.extend({
	waiverAccepted: z.literal(true, {
		message: 'You must accept the waiver to continue',
	}),
	signatureDataUrl: z
		.string()
		.min(100, 'Please provide your signature')
		.startsWith('data:image/png;base64,', 'Invalid signature format'),
});

// Step 3: Payment (client-side Stripe handles this, but we need the full schema)
export const schemaStep3 = schemaStep2.extend({
	paymentComplete: z.boolean().optional(),
});

// Final schema for server submission
export const schemaFinal = schemaStep3;

// Type exports for use in components
export type Step1Data = z.infer<typeof schemaStep1>;
export type Step2Data = z.infer<typeof schemaStep2>;
export type Step3Data = z.infer<typeof schemaStep3>;
