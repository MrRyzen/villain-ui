import { superValidate, message } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { schemaFinal } from './schema';
import { fail } from '@sveltejs/kit';

// Mock membership plans
const plans = [
	{
		id: 'basic',
		name: 'BASIC',
		price: 29,
		period: 'month',
		features: [
			'Access to gym floor',
			'Standard equipment',
			'Locker room access',
			'1 guest pass/month',
		],
		popular: false,
	},
	{
		id: 'pro',
		name: 'PRO',
		price: 59,
		period: 'month',
		features: [
			'Everything in Basic',
			'Group fitness classes',
			'Sauna & steam room',
			'3 guest passes/month',
			'Fitness assessment',
		],
		popular: true,
	},
	{
		id: 'elite',
		name: 'ELITE',
		price: 99,
		period: 'month',
		features: [
			'Everything in Pro',
			'Personal training (2x/month)',
			'Nutrition consultation',
			'Unlimited guest passes',
			'Premium locker',
			'Priority class booking',
		],
		popular: false,
	},
];

// Waiver text content
const waiverContent = `
GOAT FITNESS MEMBERSHIP AGREEMENT AND LIABILITY WAIVER

PLEASE READ THIS DOCUMENT CAREFULLY BEFORE SIGNING

1. ASSUMPTION OF RISK
I understand that physical exercise, including but not limited to weight training, cardiovascular training, and group fitness classes, involves inherent risks. I voluntarily assume all risks associated with my participation in any activities at GOAT Fitness facilities.

2. RELEASE OF LIABILITY
I hereby release, waive, and discharge GOAT Fitness, its owners, employees, agents, and representatives from any and all liability, claims, demands, and causes of action arising out of or related to any loss, damage, or injury that may be sustained by me while participating in any activities at GOAT Fitness facilities.

3. HEALTH REPRESENTATIONS
I represent that I am physically fit and have no medical condition that would prevent my full participation in exercise activities. I agree to consult with a physician before beginning any exercise program.

4. FACILITY RULES
I agree to abide by all rules and regulations of GOAT Fitness, including proper use of equipment, appropriate attire, and respectful behavior toward other members and staff.

5. MEMBERSHIP TERMS
- Monthly memberships auto-renew on the same date each month
- Cancellation requires 30 days written notice
- Membership fees are non-refundable
- Access may be suspended for rule violations

6. PERSONAL PROPERTY
GOAT Fitness is not responsible for lost, stolen, or damaged personal property. Lockers are provided for convenience only.

7. MEDIA RELEASE
I grant GOAT Fitness permission to use my likeness in photographs or videos for promotional purposes, unless I provide written notice to opt out.

8. INDEMNIFICATION
I agree to indemnify and hold harmless GOAT Fitness from any claims, damages, or expenses arising from my actions or negligence while using the facilities.

9. EMERGENCY CONTACT
I authorize GOAT Fitness to contact emergency services on my behalf if needed and to share relevant medical information with emergency responders.

10. AGREEMENT
By signing below, I acknowledge that I have read this entire agreement, understand its terms, and agree to be bound by its provisions. I am signing this agreement voluntarily and of my own free will.

This waiver shall be binding upon me, my heirs, executors, administrators, and assigns.
`.trim();

function generateMemberCode(): string {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const numbers = '0123456789';

	let code = 'GOAT-';
	// 4 alphanumeric
	for (let i = 0; i < 4; i++) {
		code += (Math.random() > 0.5 ? letters : numbers)[Math.floor(Math.random() * 10)];
	}
	code += '-';
	// 4 more alphanumeric
	for (let i = 0; i < 4; i++) {
		code += (Math.random() > 0.5 ? letters : numbers)[Math.floor(Math.random() * 10)];
	}

	return code;
}

export const load = async () => {
	const form = await superValidate(zod4(schemaFinal));
	return {
		form,
		plans,
		waiverContent,
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(schemaFinal));

		console.log('Received form submission:', form.data);

		// Simulate async processing
		await new Promise((resolve) => setTimeout(resolve, 2000));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Generate member code and QR data
		const memberCode = generateMemberCode();
		const selectedPlan = plans.find((p) => p.id === form.data.selectedPlan);

		return {
			form,
			success: true,
			memberCode,
			memberName: `${form.data.firstName} ${form.data.lastName}`,
			planName: selectedPlan?.name || 'Unknown',
			qrData: `https://goatfitness.app/access/${memberCode}`,
		};
	},
};
