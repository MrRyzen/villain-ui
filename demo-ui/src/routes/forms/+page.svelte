<script lang="ts">
	import {
		Input,
		Textarea,
		Select,
		Checkbox,
		Switch,
		RadioGroup,
		RangeSlider,
		FileUpload,
		InputGroup,
		DatePicker,
		TimePicker,
		DateTimePicker,
		Heading,
		Text,
		Card,
		Grid,
		Container,
		Badge,
		CodeBlock,
		Divider,
		Button,
		Hero,
		Code,
	} from '@mrintel/villain-ui';
	import { codeToHtml } from 'shiki';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	// Code examples
	const inputCode = `import { Input } from '@mrintel/villain-ui';

let email = $state('');
let password = $state('');

<Input
  type="email"
  bind:value={email}
  label="Email"
  placeholder="Enter your email"
/>

<Input
  type="password"
  bind:value={password}
  label="Password"
  placeholder="Enter your password"
/>

<!-- With icons -->
<Input
  type="text"
  bind:value={search}
  placeholder="Search..."
>
  {#snippet iconBefore()}
    <Icon icon="lucide:search" width="16" />
  {/snippet}
</Input>

<!-- Built-in validation -->
<Input
  type="email"
  bind:value={email}
  label="Email (with validation)"
  placeholder="test@example.com"
/>

<!-- Custom validation -->
<Input
  type="text"
  bind:value={username}
  label="Username"
  placeholder="Enter username"
  validate={(val) => {
    if (String(val).length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(String(val))) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return true;
  }}
/>`;

	const textareaCode = `import { Textarea } from '@mrintel/villain-ui';

let message = $state('');

<Textarea
  bind:value={message}
  label="Message"
  placeholder="Enter your message..."
  rows={6}
/>`;

	const selectCode = `import { Select } from '@mrintel/villain-ui';

let country = $state('');

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' }
];

<Select
  bind:value={country}
  options={countries}
  label="Country"
  placeholder="Select a country"
/>`;

	const checkboxCode = `import { Checkbox } from '@mrintel/villain-ui';

let agreed = $state(false);
let newsletter = $state(true);

<Checkbox bind:checked={agreed} label="I agree to the terms" />
<Checkbox bind:checked={newsletter} label="Subscribe to newsletter" />`;

	const switchCode = `import { Switch } from '@mrintel/villain-ui';

let darkMode = $state(false);
let notifications = $state(true);

<Switch bind:checked={darkMode} label="Dark Mode" />
<Switch bind:checked={notifications} label="Enable Notifications" />`;

	const radioCode = `import { RadioGroup } from '@mrintel/villain-ui';

let plan = $state('pro');

const plans = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' }
];

<RadioGroup
  bind:value={plan}
  options={plans}
  name="plan"
  label="Choose a plan"
/>`;

	const sliderCode = `import { RangeSlider } from '@mrintel/villain-ui';

let volume = $state(50);

<RangeSlider
  bind:value={volume}
  min={0}
  max={100}
  label="Volume"
  showValue
/>`;

	const fileUploadCode = `import { FileUpload } from '@mrintel/villain-ui';

let files = $state<FileList | null>(null);

<FileUpload
  bind:files
  accept=".jpg,.png,.pdf"
  multiple
  label="Upload documents"
  onchange={(e) => console.log('Files:', e.target.files)}
/>`;

	const inputGroupCode = `import { InputGroup, Input, Button } from '@mrintel/villain-ui';

<InputGroup>
  <Input type="text" placeholder="Username" />
  <Button variant="primary">Search</Button>
</InputGroup>`;

	const datePickerCode = `import { DatePicker } from '@mrintel/villain-ui';

let selectedDate = $state<Date | null>(null);

<DatePicker
  bind:value={selectedDate}
  label="Select a date"
  placeholder="Choose a date"
/>`;

	const timePickerCode = `import { TimePicker } from '@mrintel/villain-ui';

let selectedTime = $state<string>('');

<TimePicker
  bind:value={selectedTime}
  label="Select a time"
  placeholder="Choose a time"
/>`;

	const dateTimePickerCode = `import { DateTimePicker } from '@mrintel/villain-ui';

let selectedDateTime = $state<Date | null>(null);

<DateTimePicker
  bind:value={selectedDateTime}
  label="Select date and time"
  placeholder="Choose date and time"
/>`;

	// State for highlighted code
	let inputHtml = $state('');
	let textareaHtml = $state('');
	let selectHtml = $state('');
	let checkboxHtml = $state('');
	let switchHtml = $state('');
	let radioHtml = $state('');
	let sliderHtml = $state('');
	let fileUploadHtml = $state('');
	let inputGroupHtml = $state('');
	let datePickerHtml = $state('');
	let timePickerHtml = $state('');
	let dateTimePickerHtml = $state('');

	// Demo state
	let email = $state('');
	let validatedEmail = $state('');
	let password = $state('');
	let search = $state('');
	let numberValue = $state(0);
	let colorValue = $state('#a855f7');
	let message = $state('');
	let country = $state('');
	let agreed = $state(false);
	let newsletter = $state(true);
	let darkMode = $state(false);
	let notifications = $state(true);
	let plan = $state('pro');
	let paymentMethod = $state('card');
	let volume = $state(50);
	let brightness = $state(75);
	let files = $state<FileList | null>(null);
	let groupUsername = $state('');
	let errorInput = $state('');
	let customValidatedUsername = $state('');
	let urlInput = $state('');
	let phoneInput = $state('');
	let selectedDate = $state<Date | null>(null);
	let selectedTime = $state<string>('');
	let selectedDateTime = $state<Date | null>(null);

	// Stepper demo state
	let standaloneStep = $state(1);

	const themeOptions = [
		{ value: 'dark', label: 'Dark Mode' },
		{ value: 'light', label: 'Light Mode' },
		{ value: 'system', label: 'System Default' }
	];

	const countries = [
		{ value: 'us', label: 'United States' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'ca', label: 'Canada' },
		{ value: 'au', label: 'Australia' },
		{ value: 'de', label: 'Germany' },
		{ value: 'fr', label: 'France' },
		{ value: 'jp', label: 'Japan' }
	];

	const plans = [
		{ value: 'free', label: 'Free' },
		{ value: 'pro', label: 'Pro ($9/month)' },
		{ value: 'enterprise', label: 'Enterprise ($29/month)' }
	];

	const paymentMethods = [
		{ value: 'card', label: 'Credit Card' },
		{ value: 'paypal', label: 'PayPal' },
		{ value: 'crypto', label: 'Cryptocurrency' }
	];

	onMount(async () => {
		inputHtml = await codeToHtml(inputCode, { lang: 'svelte', theme: 'github-dark' });
		textareaHtml = await codeToHtml(textareaCode, { lang: 'svelte', theme: 'github-dark' });
		selectHtml = await codeToHtml(selectCode, { lang: 'svelte', theme: 'github-dark' });
		checkboxHtml = await codeToHtml(checkboxCode, { lang: 'svelte', theme: 'github-dark' });
		switchHtml = await codeToHtml(switchCode, { lang: 'svelte', theme: 'github-dark' });
		radioHtml = await codeToHtml(radioCode, { lang: 'svelte', theme: 'github-dark' });
		sliderHtml = await codeToHtml(sliderCode, { lang: 'svelte', theme: 'github-dark' });
		fileUploadHtml = await codeToHtml(fileUploadCode, { lang: 'svelte', theme: 'github-dark' });
		inputGroupHtml = await codeToHtml(inputGroupCode, { lang: 'svelte', theme: 'github-dark' });
		datePickerHtml = await codeToHtml(datePickerCode, { lang: 'svelte', theme: 'github-dark' });
		timePickerHtml = await codeToHtml(timePickerCode, { lang: 'svelte', theme: 'github-dark' });
		dateTimePickerHtml = await codeToHtml(dateTimePickerCode, { lang: 'svelte', theme: 'github-dark' });
	});
</script>

<Container centered padding>
	<Hero>
		{#snippet title()}
			<Heading level={1} variant="accent" glow>Form Components</Heading>
		{/snippet}
		{#snippet text()}
			<Text variant="body" as="p" color="soft">
				Beautiful, accessible form components with built-in validation and error states
			</Text>
		{/snippet}
		{#snippet features()}
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:text-cursor-input" class="tag-icon" />
				Text Inputs
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:check-square" class="tag-icon" />
				Checkboxes & Switches
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:sliders" class="tag-icon" />
				Range Sliders
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:upload" class="tag-icon" />
				File Upload
			</Badge>
		{/snippet}
	</Hero>

	<Grid cols={1} gap="lg">
		<!-- Input -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Input</Heading>
				<Text variant="body" color="soft">
					Versatile text input with support for icons, labels, and various input types
				</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Basic Inputs</Text>
					<div class="demo-group">
						<Input type="email" bind:value={email} label="Email" placeholder="Enter your email" />
						<Input
							type="password"
							bind:value={password}
							label="Password"
							placeholder="Enter your password"
						/>
					</div>
				</div>

				<div>
					<Text variant="caption" color="soft">With Icons</Text>
					<div class="demo-group">
						<Input type="text" bind:value={search} placeholder="Search...">
							{#snippet iconBefore()}
								<Icon icon="lucide:search" width="16" height="16" />
							{/snippet}
						</Input>

						<Input type="email" placeholder="Email address">
							{#snippet iconBefore()}
								<Icon icon="lucide:mail" width="16" height="16" />
							{/snippet}
						</Input>

						<Input type="text" placeholder="Enter URL">
							{#snippet iconAfter()}
								<Icon icon="lucide:external-link" width="16" height="16" />
							{/snippet}
						</Input>
					</div>
				</div>

				<div>
					<Text variant="caption" color="soft">Special Input Types</Text>
					<div class="demo-group items-center">
						<Input type="number" bind:value={numberValue} label="Quantity" placeholder="0" />

						<Input type="color" bind:value={colorValue} label="Pick a color" />

						<Input type="search" placeholder="Search products...">
							{#snippet iconBefore()}
								<Icon icon="lucide:search" width="16" height="16" />
							{/snippet}
						</Input>
					</div>
				</div>

				<div>
					<Text variant="caption" color="soft">States</Text>
					<div class="demo-group">
						<Input type="text" placeholder="Normal state" />
						<Input type="text" placeholder="Disabled state" disabled />
						<Input
							type="text"
							bind:value={errorInput}
							placeholder="Error state"
							error
							label="Username (error)"
						/>
					</div>
				</div>

				<div>
					<Text variant="caption" color="soft">Built-in Validation</Text>
					<div class="demo-group">
						<Input
							type="email"
							bind:value={validatedEmail}
							label="Email (auto-validates)"
							placeholder="test@example.com"
						/>

						<Input
							type="url"
							bind:value={urlInput}
							label="Website URL (auto-validates)"
							placeholder="https://example.com"
						/>

						<Input
							type="tel"
							bind:value={phoneInput}
							label="Phone Number (auto-validates)"
							placeholder="+1 (555) 123-4567"
						/>
					</div>
				</div>

				<div>
					<Text variant="caption" color="soft">Custom Validation Function</Text>
					<div class="demo-group">
						<Input
							type="text"
							bind:value={customValidatedUsername}
							label="Username (custom validation)"
							placeholder="Enter username"
							validate={(val) => {
								const str = String(val);
								if (str.length < 3) {
									return 'Username must be at least 3 characters';
								}
								if (!/^[a-zA-Z0-9_]+$/.test(str)) {
									return 'Username can only contain letters, numbers, and underscores';
								}
								return true;
							}}
						/>
					</div>
					<Text variant="caption" color="muted">
						Try entering invalid characters or less than 3 characters
					</Text>
				</div>

				<CodeBlock
					filename="Input.svelte"
					showLineNumbers
					lineCount={inputCode.split('\n').length}
					showCopy
					code={inputCode}
				>
					{@html inputHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Textarea -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Textarea</Heading>
				<Text variant="body" color="soft">Multi-line text input with resizable area</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Basic Textarea</Text>
					<Textarea
						bind:value={message}
						label="Message"
						placeholder="Enter your message..."
						rows={6}
					/>
				</div>

				<div>
					<Text variant="caption" color="soft">With Icon</Text>
					<Textarea placeholder="Write a comment...">
						{#snippet iconBefore()}
							<Icon icon="lucide:message-square" width="16" height="16" />
						{/snippet}
					</Textarea>
				</div>

				<CodeBlock
					filename="Textarea.svelte"
					showLineNumbers
					lineCount={textareaCode.split('\n').length}
					showCopy
					code={textareaCode}
				>
					{@html textareaHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Select -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Select</Heading>
				<Text variant="body" color="soft">Dropdown select with custom styling</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Basic Select</Text>
					<Select
						bind:value={country}
						options={countries}
						label="Country"
						placeholder="Select a country"
					/>
					{#if country}
						<Text variant="caption" color="soft">
							Selected: {countries.find((c) => c.value === country)?.label}
						</Text>
					{/if}
				</div>

				<div>
					<Text variant="caption" color="soft">With Icon</Text>
					<Select bind:value={country} options={countries} placeholder="Choose country">
						{#snippet iconBefore()}
							<Icon icon="lucide:globe" width="16" height="16" />
						{/snippet}
					</Select>
				</div>

				<div>
					<Text variant="caption" color="soft">Disabled State</Text>
					<Select options={countries} placeholder="Disabled select" disabled />
				</div>

				<CodeBlock
					filename="Select.svelte"
					showLineNumbers
					lineCount={selectCode.split('\n').length}
					showCopy
					code={selectCode}
				>
					{@html selectHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Checkbox -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Checkbox</Heading>
				<Text variant="body" color="soft">Toggle checkboxes with custom styling</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Basic Checkboxes</Text>
					<div class="demo-group-vertical">
						<Checkbox bind:checked={agreed} label="I agree to the terms and conditions" />
						<Checkbox bind:checked={newsletter} label="Subscribe to newsletter" />
						<Checkbox checked={false} label="Disabled checkbox" disabled />
					</div>
				</div>

				<div>
					<Text variant="caption" color="soft">With Icon</Text>
					<Checkbox checked={true} label="Premium feature">
						{#snippet iconBefore()}
							<Icon icon="lucide:crown" width="16" height="16" class="text-accent" />
						{/snippet}
					</Checkbox>
				</div>

				<CodeBlock
					filename="Checkbox.svelte"
					showLineNumbers
					lineCount={checkboxCode.split('\n').length}
					showCopy
					code={checkboxCode}
				>
					{@html checkboxHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Switch -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Switch</Heading>
				<Text variant="body" color="soft">Toggle switch for binary options</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Basic Switches</Text>
					<div class="demo-group-vertical">
						<Switch bind:checked={darkMode} label="Dark Mode" />
						<Switch bind:checked={notifications} label="Enable Notifications" />
						<Switch checked={false} label="Disabled switch" disabled />
					</div>
				</div>

				<div>
					<Text variant="caption" color="soft">With Icon</Text>
					<Switch checked={true} label="Auto-save enabled">
						{#snippet iconBefore()}
							<Icon icon="lucide:save" width="16" height="16" class="text-success" />
						{/snippet}
					</Switch>
				</div>

				<CodeBlock
					filename="Switch.svelte"
					showLineNumbers
					lineCount={switchCode.split('\n').length}
					showCopy
					code={switchCode}
				>
					{@html switchHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- RadioGroup -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Radio Group</Heading>
				<Text variant="body" color="soft">
					Mutually exclusive options in vertical or horizontal layout
				</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Vertical Layout</Text>
					<RadioGroup
						bind:value={plan}
						options={plans}
						name="plan"
						label="Choose a plan"
						orientation="vertical"
					/>
					<Text variant="caption" color="soft">Selected: {plan}</Text>
				</div>

				<div>
					<Text variant="caption" color="soft">Horizontal Layout</Text>
					<RadioGroup
						bind:value={paymentMethod}
						options={paymentMethods}
						name="payment"
						label="Payment Method"
						orientation="horizontal"
					/>
				</div>

				<div>
					<Text variant="caption" color="soft">Disabled State</Text>
					<RadioGroup options={plans} name="disabled-plan" label="Disabled options" disabled />
				</div>

				<CodeBlock
					filename="RadioGroup.svelte"
					showLineNumbers
					lineCount={radioCode.split('\n').length}
					showCopy
					code={radioCode}
				>
					{@html radioHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- RangeSlider -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Range Slider</Heading>
				<Text variant="body" color="soft">Slider for selecting numeric values</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Basic Slider</Text>
					<RangeSlider bind:value={volume} min={0} max={100} label="Volume" showValue />
				</div>

				<div>
					<Text variant="caption" color="soft">Custom Range and Step</Text>
					<RangeSlider
						bind:value={brightness}
						min={0}
						max={100}
						step={5}
						label="Brightness"
						showValue
					/>
				</div>

				<div>
					<Text variant="caption" color="soft">Disabled State</Text>
					<RangeSlider value={50} min={0} max={100} label="Disabled slider" disabled />
				</div>

				<CodeBlock
					filename="RangeSlider.svelte"
					showLineNumbers
					lineCount={sliderCode.split('\n').length}
					showCopy
					code={sliderCode}
				>
					{@html sliderHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- FileUpload -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>File Upload</Heading>
				<Text variant="body" color="soft">Drag-and-drop file upload with visual feedback</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Basic File Upload</Text>
					<FileUpload
						bind:files
						accept=".jpg,.png,.pdf"
						multiple
						label="Upload documents"
						onchange={(e) => console.log('Files:', e.target.files)}
					/>
				</div>

				<div>
					<Text variant="caption" color="soft">Custom Icon</Text>
					<FileUpload accept="image/*" label="Upload images">
						{#snippet icon()}
							<Icon icon="lucide:image" width="48" height="48" class="text-accent" />
						{/snippet}
					</FileUpload>
				</div>
				<CodeBlock
					filename="FileUpload.svelte"
					showLineNumbers
					lineCount={fileUploadCode.split('\n').length}
					showCopy
					code={fileUploadCode}
				>
					{@html fileUploadHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- DatePicker -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Date Picker</Heading>
				<Text variant="body" color="soft">Select dates with an intuitive calendar interface</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Basic Date Picker</Text>
					<DatePicker
						bind:value={selectedDate}
						label="Select a date"
						placeholder="Choose a date"
					/>
					{#if selectedDate}
						<Text variant="caption" color="soft">
							Selected: {selectedDate.toLocaleDateString()}
						</Text>
					{/if}
				</div>

				<CodeBlock
					filename="DatePicker.svelte"
					showLineNumbers
					lineCount={datePickerCode.split('\n').length}
					showCopy
					code={datePickerCode}
				>
					{@html datePickerHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- TimePicker -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Time Picker</Heading>
				<Text variant="body" color="soft">Select time with hour and minute controls</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Basic Time Picker</Text>
					<TimePicker
						bind:value={selectedTime}
						label="Select a time"
						placeholder="Choose a time"
					/>
					{#if selectedTime}
						<Text variant="caption" color="soft">
							Selected: {selectedTime}
						</Text>
					{/if}
				</div>

				<CodeBlock
					filename="TimePicker.svelte"
					showLineNumbers
					lineCount={timePickerCode.split('\n').length}
					showCopy
					code={timePickerCode}
				>
					{@html timePickerHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- DateTimePicker -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Date Time Picker</Heading>
				<Text variant="body" color="soft">Select both date and time in one component</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Basic Date Time Picker</Text>
					<DateTimePicker
						bind:value={selectedDateTime}
						label="Select date and time"
						placeholder="Choose date and time"
					/>
					{#if selectedDateTime}
						<Text variant="caption" color="soft">
							Selected: {selectedDateTime.toLocaleString()}
						</Text>
					{/if}
				</div>

				<CodeBlock
					filename="DateTimePicker.svelte"
					showLineNumbers
					lineCount={dateTimePickerCode.split('\n').length}
					showCopy
					code={dateTimePickerCode}
				>
					{@html dateTimePickerHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- InputGroup -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Input Group</Heading>
				<Text variant="body" color="soft">Combine inputs and buttons into a cohesive group</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Input with Button</Text>
					<InputGroup>
						<Input type="text" bind:value={groupUsername} placeholder="Username" />
						<Button variant="primary">Search</Button>
					</InputGroup>
				</div>

				<div>
					<Text variant="caption" color="soft">Multiple Inputs</Text>
					<InputGroup>
						<Input type="text" placeholder="First name" />
						<Input type="text" placeholder="Last name" />
						<Button variant="secondary">
							<Icon icon="lucide:user-plus" width="16" height="16" />
						</Button>
					</InputGroup>
				</div>

				<div>
					<Text variant="caption" color="soft">Search Bar</Text>
					<InputGroup>
						<Button variant="ghost">
							<Icon icon="lucide:search" width="16" height="16" />
						</Button>
						<Input type="search" placeholder="Search anything..." />
						<Button variant="primary">Go</Button>
					</InputGroup>
				</div>

				<CodeBlock
					filename="InputGroup.svelte"
					showLineNumbers
					lineCount={inputGroupCode.split('\n').length}
					showCopy
					code={inputGroupCode}
				>
					{@html inputGroupHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<Divider />

		<!-- Usage Tips -->
		<Card padding="lg" class="accent-surface">
			{#snippet header()}
				<Heading level={2}>Usage Tips</Heading>
			{/snippet}

			<Grid cols={2} gap="lg">
				<div>
					<Heading level={4}>Labels and Placeholders</Heading>
					<Text variant="body" color="soft">
						Use <Code>label</Code> props for accessibility. Placeholders should provide
						examples, not instructions.
					</Text>
				</div>

				<div>
					<Heading level={4}>Built-in Validation</Heading>
					<Text variant="body" color="soft">
						Input automatically validates <Code>email</Code>, <Code
							>url</Code
						>, and <Code>tel</Code> types. Validation errors appear below the input
						with helpful messages.
					</Text>
				</div>

				<div>
					<Heading level={4}>Custom Validation</Heading>
					<Text variant="body" color="soft">
						Pass a <Code>validate</Code> function to Input for custom validation.
						Return <Code>true</Code> for valid or a string error message for invalid.
						Perfect for username rules, password strength, etc.
					</Text>
				</div>

				<div>
					<Heading level={4}>Binding Values</Heading>
					<Text variant="body" color="soft">
						Use <Code>bind:value</Code> for two-way binding with Input,
						Textarea, Select, and RangeSlider. Use <Code>bind:checked</Code> for Checkbox
						and Switch.
					</Text>
				</div>

				<div>
					<Heading level={4}>Icons and Customization</Heading>
					<Text variant="body" color="soft">
						Most form components support <Code>iconBefore</Code> snippets. Use @iconify/svelte
						or any icon library for consistent iconography.
					</Text>
				</div>

				<div>
					<Heading level={4}>Input Groups</Heading>
					<Text variant="body" color="soft">
						InputGroup automatically handles borders and rounded corners. Place Input and Button
						components directly inside for seamless integration.
					</Text>
				</div>

				<div>
					<Heading level={4}>File Upload</Heading>
					<Text variant="body" color="soft">
						FileUpload supports drag-and-drop and click-to-upload. Use the <Code>accept</Code
						>
						prop to restrict file types and <Code>multiple</Code> for multiple files.
					</Text>
				</div>
			</Grid>
		</Card>
	</Grid>
</Container>

<style>
	.demo-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.demo-group-vertical {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.stepper-form-demo {
		padding: 1.5rem;
		background: var(--color-base-1);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.step-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem 0;
	}

	.confirm-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 2rem;
		text-align: center;
	}

	.stepper-nav {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
		margin-top: 1rem;
	}
</style>
