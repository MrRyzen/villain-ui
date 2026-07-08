<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Icon from '@iconify/svelte';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { schemaStep1, schemaStep2, schemaFinal } from './schema';
	import {
		Container,
		StepForm,
		StepRail,
		Input,
		Button,
		Panel,
		Heading,
		Text,
		createStepController,
		type StepDefinition,
		Grid,
		Checkbox,
		Alert,
		Card,
		type StepController,
		ProgressBar,
		Spinner,
		Badge,
		Divider,
		DatePicker,
		ScrollArea,
	} from '@mrintel/villain-ui';

	let { data, form: actionData } = $props();

	// Validation schemas per step
	const schemas = {
		info: zod4(schemaStep1),
		waiver: zod4(schemaStep2),
		payment: zod4(schemaFinal),
	};

	// Define 4-step configurations matching GOAT Fitness flow.
	// Each step carries its own validator — the controller swaps
	// superForm.options.validators on entry (no $effect needed).
	const stepDefs: StepDefinition<'info' | 'waiver' | 'payment' | 'access'>[] = [
		{
			id: 'info',
			label: 'Personal Info',
			description: 'Account & plan',
			data: ['firstName', 'lastName', 'email', 'phone', 'dob', 'password', 'confirmPassword', 'selectedPlan', 'agreedToTerms'],
			jumpPolicy: 'free',
			validator: schemas.info,
		},
		{
			id: 'waiver',
			label: 'Waiver',
			description: 'Legal agreement',
			data: ['waiverAccepted', 'signatureDataUrl'],
			jumpPolicy: 'locked',
			validator: schemas.waiver,
		},
		{
			id: 'payment',
			label: 'Payment',
			description: 'Secure checkout',
			type: 'submit',
			data: ['paymentComplete'],
			jumpPolicy: 'locked',
			validator: schemas.payment,
		},
		{
			id: 'access',
			label: 'Access',
			description: 'Your membership',
			jumpPolicy: 'locked',
		},
	];

	// Create step controller
	let ctrl: StepController<'info' | 'waiver' | 'payment' | 'access'> = createStepController({
		steps: stepDefs,
		initialStepId: 'info',
		orientation: 'horizontal',
	});

	const currentStore = ctrl.current;

	// Superform setup
	const sf = superForm(data.form, {
		dataType: 'json',
		validators: schemas.info,
		async onUpdated({ form }) {
			if (form.valid) {
				console.log('Form valid for step:', $currentStore.id);
				ctrl.onSubmitSuccess();
			} else if (!form.valid) {
				ctrl.setStepState($currentStore.id, 'error');
			}
		},
	});

	ctrl.attachFormIntegration(sf);

	const { form: formData, errors, message, submitting, enhance } = sf;

	// Per-step validators are wired via stepDefs[].validator + the controller —
	// no $effect swapping sf.options.validators.

	// Demo: force a per-step error message (e.g. simulated "email already in use").
	function simulateInfoError() {
		ctrl.setStepError('info', 'That email is already registered (demo error).');
	}

	// Signature pad state
	let signatureCanvas: HTMLCanvasElement | null = $state(null);
	let isDrawing = $state(false);
	let hasSignature = $state(false);

	// Waiver scroll tracking
	let scrollProgress = $state(0);
	let waiverScrolled = $derived(scrollProgress >= 95);

	// Signature pad functions
	function initSignaturePad() {
		if (!signatureCanvas) return;
		const ctx = signatureCanvas.getContext('2d');
		if (!ctx) return;

		ctx.strokeStyle = 'var(--color-accent)';
		ctx.lineWidth = 2;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	}

	function startDrawing(e: MouseEvent | TouchEvent) {
		if (!waiverScrolled || !signatureCanvas) return;
		isDrawing = true;
		const ctx = signatureCanvas.getContext('2d');
		if (!ctx) return;

		const rect = signatureCanvas.getBoundingClientRect();
		const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
		const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

		ctx.beginPath();
		ctx.moveTo(x, y);
	}

	function draw(e: MouseEvent | TouchEvent) {
		if (!isDrawing || !signatureCanvas) return;
		const ctx = signatureCanvas.getContext('2d');
		if (!ctx) return;

		const rect = signatureCanvas.getBoundingClientRect();
		const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
		const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

		ctx.lineTo(x, y);
		ctx.stroke();
		hasSignature = true;
	}

	function stopDrawing() {
		if (isDrawing && signatureCanvas && hasSignature) {
			$formData.signatureDataUrl = signatureCanvas.toDataURL('image/png');
		}
		isDrawing = false;
	}

	function clearSignature() {
		if (!signatureCanvas) return;
		const ctx = signatureCanvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
		hasSignature = false;
		$formData.signatureDataUrl = '';
	}

	// Initialize signature pad when canvas mounts
	$effect(() => {
		if (signatureCanvas && $currentStore.id === 'waiver') {
			initSignaturePad();
		}
	});

	// Mock payment processing
	let paymentProcessing = $state(false);

	// Navigation helpers
	const next = () => ctrl.next();
	const prev = () => ctrl.prev();

	// Check if step 1 is valid for enabling Continue button
	const step1Valid = $derived(
		$formData.firstName &&
		$formData.lastName &&
		$formData.email &&
		$formData.phone?.length === 10 &&
		$formData.dob &&
		$formData.password?.length >= 8 &&
		$formData.confirmPassword === $formData.password &&
		$formData.selectedPlan &&
		$formData.agreedToTerms
	);

	// Check if step 2 is valid
	const step2Valid = $derived(
		waiverScrolled &&
		hasSignature &&
		$formData.waiverAccepted
	);
</script>

<Container centered padding size="lg">
	<!-- Header -->
	<div class="text-center mb-8">
		<Heading level={1} as="h1" glow variant="accent">
			JOIN THE GOATS
		</Heading>
		<Text variant="body" color="muted" as="p">
			Your fitness journey starts here
		</Text>
	</div>

	<Panel padding="lg" variant="glass" class="mb-6">
		<StepForm
			method="POST"
			steps={stepDefs}
			controller={ctrl}
			orientation="horizontal"
			{enhance}
		>
			{#snippet rail({ steps, current, goTo })}
				<StepRail
					size="md"
					{steps}
					{current}
					orientation="horizontal"
					onSelect={goTo}
					showNumbers={true}
					showLabels={true}
				/>
			{/snippet}

			{#snippet step({ step })}
				<!-- STEP 1: Personal Info + Plan Selection -->
				{#if step.id === 'info'}
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<!-- Left: Form Section -->
						<div>
							<Heading level={3} as="h3" glow variant="accent">
								Personal Information
							</Heading>

							<Grid cols={2} gap="md">
								<Input
									name="firstName"
									type="text"
									label="First Name"
									placeholder="John"
									bind:value={$formData.firstName}
									error={!!$errors.firstName}
									validationMessage={$errors.firstName?.[0]}
									showValidation={true}

								>
									{#snippet iconBefore()}
										<Icon icon="mdi:account" />
									{/snippet}
								</Input>

								<Input
									name="lastName"
									type="text"
									label="Last Name"
									placeholder="Doe"
									bind:value={$formData.lastName}
									error={!!$errors.lastName}
									validationMessage={$errors.lastName?.[0]}
									showValidation={true}
								>
									{#snippet iconBefore()}
										<Icon icon="mdi:account" />
									{/snippet}
								</Input>

								<div class="col-span-2">
									<Input
										name="email"
										type="email"
										label="Email Address"
										placeholder="john@example.com"
										bind:value={$formData.email}
										error={!!$errors.email}
										validationMessage={$errors.email?.[0]}
										showValidation={true}
										autocomplete="email"
									>
										{#snippet iconBefore()}
											<Icon icon="mdi:email" />
										{/snippet}
									</Input>
								</div>

								<Input
									name="phone"
									type="tel"
									label="Phone Number"
									placeholder="1234567890"
									bind:value={$formData.phone}
									error={!!$errors.phone}
									validationMessage={$errors.phone?.[0]}
									showValidation={true}
								>
									{#snippet iconBefore()}
										<Icon icon="mdi:phone" />
									{/snippet}
								</Input>

								<DatePicker
									variant="floating"
									name="dob"
									label="Date of Birth"
									placeholder="YYYY-MM-DD"
									bind:value={$formData.dob}
									autocomplete="bday-day"
									error={!!$errors.dob}
								/>

								<Input
									name="password"
									type="password"
									label="Password"
									placeholder="Min 8 characters"
									bind:value={$formData.password}
									error={!!$errors.password}
									validationMessage={$errors.password?.[0]}
									showValidation={true}
									autocomplete="new-password"
								>
									{#snippet iconBefore()}
										<Icon icon="mdi:lock" />
									{/snippet}
								</Input>

								<Input
									name="confirmPassword"
									type="password"
									label="Confirm Password"
									placeholder="Re-enter password"
									bind:value={$formData.confirmPassword}
									error={!!$errors.confirmPassword}
									validationMessage={$errors.confirmPassword?.[0]}
									showValidation={true}
									autocomplete="new-password"
								>
									{#snippet iconBefore()}
										<Icon icon="mdi:lock-check" />
									{/snippet}
								</Input>
							</Grid>

							<div class="mt-6">
								<Checkbox
									name="agreedToTerms"
									label="I agree to the Terms of Service and Privacy Policy"
									bind:checked={$formData.agreedToTerms}
								/>
								{#if $errors.agreedToTerms}
									<Text variant="caption" color="error" as="p">
										{$errors.agreedToTerms[0]}
									</Text>
								{/if}
							</div>

							<div class="mt-4">
								<Button variant="ghost" size="sm" onclick={simulateInfoError}>
									<Icon icon="mdi:alert" class="mr-2" />
									Simulate server error
								</Button>
							</div>
						</div>

						<!-- Right: Plan Selection -->
						<div>
							<Heading level={3} as="h3" glow variant="accent">
								Select Your Plan
							</Heading>

							<div class="space-y-4">
								{#each data.plans as plan}
									{@const isSelected = $formData.selectedPlan === plan.id}
									<Card
										padding="md"
										onclick={() => ($formData.selectedPlan = plan.id)}
										selected={isSelected}
										class="relative transition-all duration-300 {isSelected ? 'ring-2 ring-accent scale-[1.02]' : 'hover:scale-[1.01]'}"
									>
										{#if plan.popular}
											<Badge variant="accent" size="sm" class="absolute -top-2 right-4">
												POPULAR
											</Badge>
										{/if}

										<div class="flex justify-between items-start mb-3">
											<div>
												<Heading level={4} as="h4">{plan.name}</Heading>
												<Text variant="body" color="default" as="span" weight="bold">
													${plan.price}
												</Text>
												<Text variant="caption" color="muted" as="span">/{plan.period}</Text>
											</div>
											<div class="w-6 h-6 rounded-full border-2 flex items-center justify-center {isSelected ? 'border-accent bg-accent' : 'border-border-strong'}">
												{#if isSelected}
													<Icon icon="mdi:check" class="text-white text-sm" />
												{/if}
											</div>
										</div>

										<ul class="space-y-2">
											{#each plan.features as feature}
												<li class="flex items-center gap-2 text-sm text-text-soft">
													<Icon icon="mdi:check-circle" class="text-accent shrink-0" />
													{feature}
												</li>
											{/each}
										</ul>
									</Card>
								{/each}
							</div>

							{#if $errors.selectedPlan}
								<Text variant="caption" color="error" as="p">
									{$errors.selectedPlan[0]}
								</Text>
							{/if}
						</div>
					</div>

				<!-- STEP 2: Waiver Signing -->
				{:else if step.id === 'waiver'}
					<div>
						<Heading level={3} as="h3" glow variant="accent">
							Membership Waiver
						</Heading>
						<Text variant="body" color="muted" as="p">
							Please read the entire waiver document and sign below
						</Text>

						<!-- Scroll Progress -->
						<div class="mb-4">
							<div class="flex justify-between text-sm mb-1">
								<Text variant="caption" color="muted">Reading progress</Text>
								<Text variant="caption" color={waiverScrolled ? 'success' : 'muted'}>
									{waiverScrolled ? 'Complete' : `${Math.round(scrollProgress)}%`}
								</Text>
							</div>
							<ProgressBar value={scrollProgress} max={100} size="sm" />
						</div>

						<!-- Waiver Document -->
						<div class="bg-base-2 border border-border rounded-lg mb-6">
							<ScrollArea height="40vh" bind:scrollPercent={scrollProgress}>
								<div class="p-6 font-mono text-sm leading-relaxed">
									<pre class="whitespace-pre-wrap text-text-soft">{data.waiverContent}</pre>
								</div>
							</ScrollArea>
						</div>

						<!-- Signature Section -->
						<div class="border border-border rounded-lg p-6 {!waiverScrolled ? 'opacity-50' : ''}">
							<div class="flex justify-between items-center mb-4">
								<Heading level={4} as="h4">Your Signature</Heading>
								{#if !waiverScrolled}
									<Badge variant="warning" size="sm">
										<Icon icon="mdi:lock" class="mr-1" />
										Scroll to unlock
									</Badge>
								{/if}
							</div>

							<div class="relative">
								<canvas
									bind:this={signatureCanvas}
									width={500}
									height={150}
									class="w-full border-2 border-dashed rounded-lg bg-base-1 {waiverScrolled ? 'border-border-strong cursor-crosshair' : 'border-border cursor-not-allowed'}"
									onmousedown={startDrawing}
									onmousemove={draw}
									onmouseup={stopDrawing}
									onmouseleave={stopDrawing}
									ontouchstart={startDrawing}
									ontouchmove={draw}
									ontouchend={stopDrawing}
								></canvas>

								{#if !hasSignature && waiverScrolled}
									<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
										<Text variant="caption" color="muted">Draw your signature here</Text>
									</div>
								{/if}
							</div>

							<div class="flex justify-between items-center mt-4">
								<Button variant="ghost" size="sm" onclick={clearSignature} disabled={!hasSignature}>
									<Icon icon="mdi:eraser" class="mr-2" />
									Clear
								</Button>

								{#if hasSignature}
									<Text variant="caption" color="success">
										<Icon icon="mdi:check-circle" class="mr-1" />
										Signed on {new Date().toLocaleDateString()}
									</Text>
								{/if}
							</div>

							<div class="mt-4">
								<Checkbox
									name="waiverAccepted"
									label="I have read and agree to the terms of this waiver"
									bind:checked={$formData.waiverAccepted}
									disabled={!waiverScrolled || !hasSignature}
								/>
							</div>
						</div>
					</div>

				<!-- STEP 3: Payment -->
				{:else if step.id === 'payment'}
					<div class="max-w-md mx-auto">
						<Heading level={3} as="h3" glow variant="accent">
							Complete Your Purchase
						</Heading>

						<!-- Order Summary -->
						<Card padding="md" class="mb-6">
							{#snippet header()}
								<div class="flex justify-between items-center">
									<Text variant="body" color="muted">Order Summary</Text>
									<Icon icon="mdi:receipt" class="text-text-soft" />
								</div>
							{/snippet}

							{@const selectedPlan = data.plans.find(p => p.id === $formData.selectedPlan)}
							{#if selectedPlan}
								<div class="flex justify-between items-center py-2">
									<div>
										<Text variant="body" as="span">{selectedPlan.name} Membership</Text>
										<Text variant="caption" color="muted" as="p">Monthly subscription</Text>
									</div>
									<Text variant="body" color="default" as="span">${selectedPlan.price}</Text>
								</div>
								<Divider class="my-3" />
								<div class="flex justify-between items-center">
									<Text variant="body" as="span" weight="semibold">Total</Text>
									<Text variant="body" color="default" as="span" weight="bold">${selectedPlan.price}/mo</Text>
								</div>
							{/if}
						</Card>

						<!-- Mock Payment Form -->
						<Card padding="md" class="mb-6">
							{#snippet header()}
								<div class="flex items-center gap-2">
									<Icon icon="mdi:lock" class="text-accent" />
									<Text variant="body">Secure Payment</Text>
								</div>
							{/snippet}

							<div class="space-y-4">
								<Input
									name="cardNumber"
									type="text"
									label="Card Number"
									placeholder="4242 4242 4242 4242"
									disabled={paymentProcessing || $submitting}
								>
									{#snippet iconBefore()}
										<Icon icon="mdi:credit-card" />
									{/snippet}
								</Input>

								<Grid cols={2} gap="md">
									<Input
										name="expiry"
										type="text"
										label="Expiry"
										placeholder="MM/YY"
										disabled={paymentProcessing || $submitting}
									/>
									<Input
										name="cvc"
										type="text"
										label="CVC"
										placeholder="123"
										disabled={paymentProcessing || $submitting}
									>
										{#snippet iconAfter()}
											<Icon icon="mdi:help-circle-outline" class="text-text-muted" />
										{/snippet}
									</Input>
								</Grid>
							</div>

							{#snippet footer()}
								<div class="flex items-center justify-center gap-4 text-text-muted">
									<Icon icon="logos:visa" width="32" />
									<Icon icon="logos:mastercard" width="32" />
									<Icon icon="logos:amex" width="32" />
								</div>
							{/snippet}
						</Card>

						{#if paymentProcessing || $submitting}
							<div class="text-center py-4">
								<Spinner size="lg" />
								<Text variant="body" color="muted" as="p">
									Processing payment...
								</Text>
							</div>
						{/if}
					</div>

				<!-- STEP 4: Access Activation -->
				{:else if step.id === 'access'}
					<div class="text-center py-8">
						{#if actionData?.success}
							<!-- Success State -->
							<div class="animate-fade-in">
								<div class="mb-6">
									<div class="w-20 h-20 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-4">
										<Icon icon="mdi:check-circle" class="text-accent text-4xl" />
									</div>
									<Heading level={2} as="h2" glow variant="accent">
										ACCESS GRANTED
									</Heading>
									<Text variant="body" color="muted" as="p">
										Welcome to GOAT Fitness, {actionData.memberName}!
									</Text>
								</div>

								<!-- QR Code Placeholder -->
								<Card padding="lg" class="max-w-sm mx-auto mb-6">
									<div class="bg-white p-4 rounded-lg mb-4">
										<div class="w-48 h-48 mx-auto bg-base-2 rounded flex items-center justify-center">
											<Icon icon="mdi:qrcode" class="text-6xl text-text-muted" />
										</div>
									</div>

									<Badge variant="accent" size="md" class="mb-2">
										{actionData.planName} MEMBER
									</Badge>

									<Text variant="body" as="p">
										{actionData.memberCode}
									</Text>
									<Text variant="caption" color="muted" as="p">
										Scan at any GOAT Fitness location
									</Text>
								</Card>

								<div class="flex flex-col sm:flex-row gap-4 justify-center">
									<Button variant="primary" size="lg">
										<Icon icon="mdi:view-dashboard" class="mr-2" />
										Go to Dashboard
									</Button>
									<Button variant="ghost" size="lg">
										<Icon icon="mdi:download" class="mr-2" />
										Download QR Code
									</Button>
								</div>

								<Divider class="my-6" />

								<Text variant="caption" color="muted" as="p">
									Get the GOAT Fitness app
								</Text>
								<div class="flex gap-4 justify-center">
									<Button variant="ghost" size="sm">
										<Icon icon="mdi:apple" class="mr-2" />
										App Store
									</Button>
									<Button variant="ghost" size="sm">
										<Icon icon="mdi:google-play" class="mr-2" />
										Google Play
									</Button>
								</div>
							</div>
						{:else}
							<!-- Loading State -->
							<div class="py-12">
								<Spinner size="lg" />
								<Heading level={3} as="h3">
									Activating Your Account
								</Heading>
								<Text variant="body" color="muted" as="p">
									Please wait while we set up your membership...
								</Text>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Global Error Message -->
				{#if $message}
					<Alert variant="error" dismissible class="mt-6">
						{$message}
					</Alert>
				{/if}
			{/snippet}

			{#snippet actions({ loading, isFirst, isSubmit })}
				{@const isLast = $currentStore.index === stepDefs.length - 1}
				{@const currentStepId = $currentStore.id}

				<!-- Back Button (hidden on first and last steps, and payment) -->
				{#if !isFirst && !isLast && currentStepId !== 'payment'}
					<Button variant="ghost" onclick={prev} disabled={loading || $submitting}>
						<Icon icon="mdi:arrow-left" class="mr-2" />
						Back
					</Button>
				{:else}
					<div></div>
				{/if}

				<!-- Action Button -->
				{#if currentStepId === 'info'}
					<Button
						variant="primary"
						onclick={next}
						disabled={!step1Valid || loading || $submitting}
					>
						Continue to Waiver
						<Icon icon="mdi:arrow-right" class="ml-2" />
					</Button>
				{:else if currentStepId === 'waiver'}
					<Button
						variant="primary"
						onclick={next}
						disabled={!step2Valid || loading || $submitting}
					>
						Continue to Payment
						<Icon icon="mdi:arrow-right" class="ml-2" />
					</Button>
				{:else if currentStepId === 'payment'}
					<Button
						type="submit"
						variant="primary"
						disabled={loading || $submitting || paymentProcessing}
					>
						{#if loading || $submitting || paymentProcessing}
							<Spinner size="sm" />
							Processing...
						{:else}
							<Icon icon="mdi:lock" class="mr-2" />
							Confirm Payment
						{/if}
					</Button>
				{:else if isLast && actionData?.success}
					<Button variant="primary" onclick={() => ctrl.reset()}>
						<Icon icon="mdi:refresh" class="mr-2" />
						Start Over
					</Button>
				{:else}
					<div></div>
				{/if}
			{/snippet}
		</StepForm>
	</Panel>
</Container>

<style>
	/* Fade in animation for success state */
	.animate-fade-in {
		animation: fadeIn 0.6s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
