<script lang="ts">
	import {
		Card,
		Grid,
		Container,
		Heading,
		Text,
		Table,
		Divider,
		Input,
		Textarea,
		Select,
		Checkbox,
		Switch,
		RadioGroup,
		RangeSlider,
		InputGroup,
		FileUpload,
		Button,
		ProgressBar
	} from '@mrintel/villain-ui';
	import Icon from '@iconify/svelte';

	// State management
	let username = $state('');
	let email = $state('');
	let email2 = $state('');
	let password = $state('');
	let password2 = $state('');
	let message = $state('');
	let country = $state('');
	let termsAccepted = $state(false);
	let notificationsEnabled = $state(false);
	let size = $state('md');
	let volume = $state(50);
	let uploadedFiles = $state<FileList | null>(null);

	// Control states
	let showErrors = $state(false);
	let disabledState = $state(false);
	let selectedOrientation = $state<'vertical' | 'horizontal'>('vertical');

	// Validation states
	let emailError = $state(false);
	let passwordError = $state(false);
	let messageError = $state(false);
	let termsError = $state(false);

	// Additional states for demos
	let feature1 = $state(false);
	let feature2 = $state(true);
	let feature3 = $state(false);
	let darkMode = $state(false);
	let autoSave = $state(true);
	let soundEnabled = $state(false);
	let protocol = $state('https://');
	let domain = $state('');
	let tld = $state('.com');
	let priceValue = $state('');
	let searchQuery = $state('');

	// File upload progress tracking (simulated for demo)
	let fileProgress = $state<Map<string, number>>(new Map());

	// Simulate upload progress when files change
	$effect(() => {
		if (uploadedFiles && uploadedFiles.length > 0) {
			const files = Array.from(uploadedFiles);
			files.forEach(file => {
				if (!fileProgress.has(file.name)) {
					// Start at 0 for new files
					fileProgress.set(file.name, 0);
					// Simulate progress
					let progress = 0;
					const interval = setInterval(() => {
						progress += Math.random() * 30;
						if (progress >= 100) {
							progress = 100;
							clearInterval(interval);
						}
						fileProgress.set(file.name, progress);
						fileProgress = new Map(fileProgress); // Trigger reactivity
					}, 200);
				}
			});
		}
	});

	// Helper function
	function validateEmail(value: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(value);
	}

	function validateForm() {
		emailError = !email || !validateEmail(email);
		passwordError = !password || password.length < 6;
		messageError = !message;
		termsError = !termsAccepted;
	}

	function resetForm() {
		email = '';
		password = '';
		message = '';
		country = '';
		termsAccepted = false;
		emailError = false;
		passwordError = false;
		messageError = false;
		termsError = false;
	}

	// Options for Select
	const countryOptions = [
		{ value: 'us', label: 'United States' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'ca', label: 'Canada' },
		{ value: 'au', label: 'Australia' },
		{ value: 'de', label: 'Germany' }
	];

	// Options for RadioGroup
	const sizeOptions = [
		{ value: 'sm', label: 'Small' },
		{ value: 'md', label: 'Medium' },
		{ value: 'lg', label: 'Large' }
	];

	const paymentOptions = [
		{ value: 'card', label: 'Credit Card' },
		{ value: 'wallet', label: 'Digital Wallet' }
	];

	// Props table columns
	const tableColumns = [
		{ key: 'prop', label: 'Prop', sortable: true },
		{ key: 'type', label: 'Type', sortable: true },
		{ key: 'default', label: 'Default' },
		{ key: 'description', label: 'Description' }
	];

	// Props data for Input
	const inputProps = [
		{ prop: 'type', type: 'string', default: 'text', description: 'Input type (text, email, password, number, etc.)' },
		{ prop: 'value', type: 'string', default: '""', description: 'Input value (use bind:value)' },
		{ prop: 'placeholder', type: 'string', default: '""', description: 'Placeholder text' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input' },
		{ prop: 'error', type: 'boolean', default: 'false', description: 'Show error state' },
		{ prop: 'label', type: 'string', default: '""', description: 'Input label' },
		{ prop: 'id', type: 'string', default: 'auto', description: 'HTML id attribute' },
		{ prop: 'oninput', type: 'function', default: 'undefined', description: 'Input change handler' },
		{ prop: 'iconBefore', type: 'snippet', default: 'undefined', description: 'Icon snippet before input' },
		{ prop: 'iconAfter', type: 'snippet', default: 'undefined', description: 'Icon snippet after input' },
		{ prop: 'class', type: 'string', default: '""', description: 'Additional CSS classes' }
	];

	// Props data for Textarea
	const textareaProps = [
		{ prop: 'value', type: 'string', default: '""', description: 'Textarea value (use bind:value)' },
		{ prop: 'placeholder', type: 'string', default: '""', description: 'Placeholder text' },
		{ prop: 'rows', type: 'number', default: '4', description: 'Number of visible rows' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the textarea' },
		{ prop: 'error', type: 'boolean', default: 'false', description: 'Show error state' },
		{ prop: 'label', type: 'string', default: '""', description: 'Textarea label' },
		{ prop: 'id', type: 'string', default: 'auto', description: 'HTML id attribute' },
		{ prop: 'oninput', type: 'function', default: 'undefined', description: 'Input change handler' },
		{ prop: 'iconBefore', type: 'snippet', default: 'undefined', description: 'Icon snippet before textarea' },
		{ prop: 'class', type: 'string', default: '""', description: 'Additional CSS classes' }
	];

	// Props data for Select
	const selectProps = [
		{ prop: 'value', type: 'string', default: '""', description: 'Selected value (use bind:value)' },
		{ prop: 'options', type: 'Array<{value: string, label: string}>', default: 'required', description: 'Array of options' },
		{ prop: 'placeholder', type: 'string', default: '""', description: 'Placeholder text' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the select' },
		{ prop: 'error', type: 'boolean', default: 'false', description: 'Show error state' },
		{ prop: 'label', type: 'string', default: '""', description: 'Select label' },
		{ prop: 'id', type: 'string', default: 'auto', description: 'HTML id attribute' },
		{ prop: 'onchange', type: 'function', default: 'undefined', description: 'Change handler' },
		{ prop: 'iconBefore', type: 'snippet', default: 'undefined', description: 'Icon snippet before select' },
		{ prop: 'class', type: 'string', default: '""', description: 'Additional CSS classes' }
	];

	// Props data for Checkbox
	const checkboxProps = [
		{ prop: 'checked', type: 'boolean', default: 'false', description: 'Checked state (use bind:checked)' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the checkbox' },
		{ prop: 'label', type: 'string', default: '""', description: 'Checkbox label' },
		{ prop: 'id', type: 'string', default: 'auto', description: 'HTML id attribute' },
		{ prop: 'onchange', type: 'function', default: 'undefined', description: 'Change handler' },
		{ prop: 'iconBefore', type: 'snippet', default: 'undefined', description: 'Icon snippet before checkbox' },
		{ prop: 'class', type: 'string', default: '""', description: 'Additional CSS classes' }
	];

	// Props data for Switch
	const switchProps = [
		{ prop: 'checked', type: 'boolean', default: 'false', description: 'Toggle state (use bind:checked)' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the switch' },
		{ prop: 'label', type: 'string', default: '""', description: 'Switch label' },
		{ prop: 'id', type: 'string', default: 'auto', description: 'HTML id attribute' },
		{ prop: 'onchange', type: 'function', default: 'undefined', description: 'Change handler' },
		{ prop: 'iconBefore', type: 'snippet', default: 'undefined', description: 'Icon snippet before switch' },
		{ prop: 'class', type: 'string', default: '""', description: 'Additional CSS classes' }
	];

	// Props data for RadioGroup
	const radioGroupProps = [
		{ prop: 'value', type: 'string', default: '""', description: 'Selected value (use bind:value)' },
		{ prop: 'options', type: 'Array<{value: string, label: string}>', default: 'required', description: 'Array of radio options' },
		{ prop: 'name', type: 'string', default: 'required', description: 'Radio group name' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable all radios' },
		{ prop: 'orientation', type: '"vertical" | "horizontal"', default: '"vertical"', description: 'Layout orientation' },
		{ prop: 'label', type: 'string', default: '""', description: 'Group label' },
		{ prop: 'onchange', type: 'function', default: 'undefined', description: 'Change handler' },
		{ prop: 'class', type: 'string', default: '""', description: 'Additional CSS classes' }
	];

	// Props data for RangeSlider
	const rangeSliderProps = [
		{ prop: 'value', type: 'number', default: '0', description: 'Slider value (use bind:value)' },
		{ prop: 'min', type: 'number', default: '0', description: 'Minimum value' },
		{ prop: 'max', type: 'number', default: '100', description: 'Maximum value' },
		{ prop: 'step', type: 'number', default: '1', description: 'Step increment' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the slider' },
		{ prop: 'label', type: 'string', default: '""', description: 'Slider label' },
		{ prop: 'showValue', type: 'boolean', default: 'true', description: 'Show current value' },
		{ prop: 'id', type: 'string', default: 'auto', description: 'HTML id attribute' },
		{ prop: 'oninput', type: 'function', default: 'undefined', description: 'Input change handler' }
	];

	// Props data for InputGroup
	const inputGroupProps = [
		{ prop: '—', type: '—', default: '—', description: 'No props – uses slot-only composition. Child elements are automatically styled with merged borders.' }
	];

	// Props data for FileUpload
	const fileUploadProps = [
		{ prop: 'files', type: 'FileList | null', default: 'null', description: 'Uploaded files (use bind:files)' },
		{ prop: 'accept', type: 'string', default: '""', description: 'Accepted file types' },
		{ prop: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple files' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable file upload' },
		{ prop: 'label', type: 'string', default: '""', description: 'Upload label' },
		{ prop: 'id', type: 'string', default: 'auto', description: 'HTML id attribute' },
		{ prop: 'onchange', type: 'function', default: 'undefined', description: 'Change callback receiving {target: {files: FileList}}' },
		{ prop: 'icon', type: 'snippet', default: 'undefined', description: 'Custom icon snippet' }
	];
</script>

<Container>
	<!-- Hero Section -->
	<div class="demo-section">
		<Heading level={1} glow={true} variant="gradient">Form Components</Heading>
		<div style="margin-top: 1rem;">
			<Text color="muted">
				9 interactive form components with validation, icons, and accessibility features
			</Text>
		</div>
		<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.5rem;">
			<span class="feature-tag">9 Components</span>
			<span class="feature-tag">Validation</span>
			<span class="feature-tag">Icon Support</span>
			<span class="feature-tag">Accessible</span>
			<span class="feature-tag">Drag & Drop</span>
		</div>
	</div>

	<!-- Input Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>Input</Heading>
			<Text color="muted">Text input with multiple types, labels, icons, and error states</Text>

			<Divider />

			<div class="controls-section">
				<Grid cols={2}>
					<Checkbox bind:checked={showErrors} label="Show errors" />
					<Checkbox bind:checked={disabledState} label="Disabled state" />
				</Grid>
			</div>

			<div class="examples-grid">
				<Heading level={4}>Basic Inputs</Heading>
				<Grid cols={2}>
					<Input type="text" label="Username" bind:value={username} placeholder="Enter username" />
					<Input type="email" label="Email" bind:value={email} placeholder="your@email.com" />
					<Input type="password" label="Password" bind:value={password} placeholder="Enter password" />
					<Input type="number" label="Age" placeholder="25" />
				</Grid>

				<div style="margin-top: 2rem;">
					<Heading level={4}>With Icons</Heading>
				</div>
				<Grid cols={2}>
					<Input label="Search" placeholder="Search...">
						{#snippet iconBefore()}
							<Icon icon="lucide:search" width="18" />
						{/snippet}
					</Input>
					<Input type="password" label="Password" placeholder="Enter password">
						{#snippet iconAfter()}
							<Icon icon="lucide:eye" width="18" />
						{/snippet}
					</Input>
					<Input label="Email" placeholder="your@email.com">
						{#snippet iconBefore()}
							<Icon icon="lucide:mail" width="18" />
						{/snippet}
						{#snippet iconAfter()}
							<Icon icon="lucide:check-circle" width="18" />
						{/snippet}
					</Input>
				</Grid>

				<div style="margin-top: 2rem;">
					<Heading level={4}>Error States</Heading>
				</div>
				<Grid cols={2}>
					<Input
						type="email"
						label="Email"
						bind:value={email2}
						error={showErrors}
						placeholder="your@email.com"
					/>
					<Input
						type="password"
						label="Password"
						bind:value={password2}
						error={showErrors}
						placeholder="Enter password"
					/>
				</Grid>

				<div style="margin-top: 2rem;">
					<Heading level={4}>Disabled State</Heading>
				</div>
				<Input label="Disabled Input" disabled={disabledState} placeholder="Cannot edit" />
			</div>

			<div style="margin-top: 2rem;">
				<Divider />
			</div>

			<div style="margin-top: 1rem;">
				<Heading level={4}>Props</Heading>
			</div>
			<Table columns={tableColumns} data={inputProps} />
		</Card>
	</div>

	<!-- Textarea Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>Textarea</Heading>
			<Text color="muted">Multi-line text input with adjustable rows and icon support</Text>

			<Divider />

			<div class="examples-grid">
				<Heading level={4}>Basic Usage</Heading>
				<Textarea label="Comment" rows={4} bind:value={message} placeholder="Enter your comment..." />

				<div class="subsection">
					<Heading level={4}>With Icon</Heading>
				</div>
				<Textarea label="Message" rows={4} placeholder="Type your message...">
					{#snippet iconBefore()}
						<Icon icon="lucide:message-square" width="18" />
					{/snippet}
				</Textarea>

				<div class="subsection">
					<Heading level={4}>Error State</Heading>
				</div>
				<Textarea
					label="Required Field"
					rows={4}
					bind:value={message}
					error={showErrors && !message}
					placeholder="This field is required"
				/>

				<div class="subsection">
					<Heading level={4}>Disabled</Heading>
				</div>
				<Textarea label="Disabled Textarea" rows={4} disabled={disabledState} placeholder="Cannot edit" />
			</div>

			<div class="section-spacing">
				<Divider />
			</div>

			<div class="small-spacing">
				<Heading level={4}>Props</Heading>
			</div>
			<Table columns={tableColumns} data={textareaProps} />
		</Card>
	</div>

	<!-- Select Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>Select</Heading>
			<Text color="muted">Dropdown selection with options array and icon support</Text>

			<Divider />

			<div class="examples-grid">
				<Heading level={4}>Basic Select</Heading>
				<Select
					label="Country"
					options={countryOptions}
					bind:value={country}
					placeholder="Choose a country"
				/>

				<div class="subsection">
					<Heading level={4}>With Icon</Heading>
				</div>
				<Select label="Location" options={countryOptions} bind:value={country} placeholder="Select location">
					{#snippet iconBefore()}
						<Icon icon="lucide:globe" width="18" />
					{/snippet}
				</Select>

				<div class="subsection">
					<Heading level={4}>Error State</Heading>
				</div>
				<Select
					label="Required Selection"
					options={countryOptions}
					bind:value={country}
					error={showErrors && !country}
					placeholder="Please select"
				/>

				<div class="subsection">
					<Heading level={4}>Disabled</Heading>
				</div>
				<Select
					label="Disabled Select"
					options={countryOptions}
					disabled={disabledState}
					placeholder="Cannot select"
				/>
			</div>

			<div class="section-spacing">
				<Divider />
			</div>

			<div class="small-spacing">
				<Heading level={4}>Props</Heading>
			</div>
			<Table columns={tableColumns} data={selectProps} />
		</Card>
	</div>

	<!-- Checkbox Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>Checkbox</Heading>
			<Text color="muted">Boolean selection with label and icon support</Text>

			<Divider />

			<div class="examples-grid">
				<Heading level={4}>Basic Checkbox</Heading>
				<Checkbox bind:checked={termsAccepted} label="I accept the terms and conditions" />

				<div class="subsection">
					<Heading level={4}>With Icon</Heading>
				</div>
				<Checkbox bind:checked={termsAccepted} label="Verify with shield protection">
					{#snippet iconBefore()}
						<Icon icon="lucide:shield-check" width="18" />
					{/snippet}
				</Checkbox>

				<div class="subsection">
					<Heading level={4}>Checkbox Group</Heading>
				</div>
				<div style="display: flex; flex-direction: column; gap: 0.75rem;">
					<Checkbox bind:checked={feature1} label="Enable feature 1" />
					<Checkbox bind:checked={feature2} label="Enable feature 2" />
					<Checkbox bind:checked={feature3} label="Enable feature 3" />
				</div>

				<div class="subsection">
					<Heading level={4}>Disabled</Heading>
				</div>
				<Checkbox label="Disabled checkbox" disabled={disabledState} />
			</div>

			<div class="section-spacing">
				<Divider />
			</div>

			<div class="small-spacing">
				<Heading level={4}>Props</Heading>
			</div>
			<Table columns={tableColumns} data={checkboxProps} />
		</Card>
	</div>

	<!-- Switch Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>Switch</Heading>
			<Text color="muted">Toggle switch with smooth animation and icon support</Text>

			<Divider />

			<div class="examples-grid">
				<Heading level={4}>Basic Switch</Heading>
				<Switch bind:checked={notificationsEnabled} label="Enable notifications" />

				<div class="subsection">
					<Heading level={4}>With Icon</Heading>
				</div>
				<Switch bind:checked={notificationsEnabled} label="Notification alerts">
					{#snippet iconBefore()}
						<Icon icon="lucide:bell" width="18" />
					{/snippet}
				</Switch>

				<div class="subsection">
					<Heading level={4}>Multiple Switches</Heading>
				</div>
				<Grid cols={2}>
					<Switch bind:checked={darkMode} label="Dark mode" />
					<Switch bind:checked={autoSave} label="Auto-save" />
					<Switch bind:checked={soundEnabled} label="Sound effects" />
					<Switch bind:checked={notificationsEnabled} label="Push notifications" />
				</Grid>

				<div class="subsection">
					<Heading level={4}>Disabled</Heading>
				</div>
				<Switch label="Disabled switch" disabled={disabledState} />
			</div>

			<div class="section-spacing">
				<Divider />
			</div>

			<div class="small-spacing">
				<Heading level={4}>Props</Heading>
			</div>
			<Table columns={tableColumns} data={switchProps} />
		</Card>
	</div>

	<!-- RadioGroup Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>RadioGroup</Heading>
			<Text color="muted">Single selection from multiple options with orientation control</Text>

			<Divider />

			<div class="controls-section">
				<div style="display: flex; gap: 0.5rem;">
					<Button
						variant={selectedOrientation === 'vertical' ? 'primary' : 'secondary'}
						size="sm"
						onclick={() => (selectedOrientation = 'vertical')}
					>
						Vertical
					</Button>
					<Button
						variant={selectedOrientation === 'horizontal' ? 'primary' : 'secondary'}
						size="sm"
						onclick={() => (selectedOrientation = 'horizontal')}
					>
						Horizontal
					</Button>
				</div>
			</div>

			<div class="examples-grid">
				<Heading level={4}>Basic RadioGroup</Heading>
				<RadioGroup
					name="size-selection"
					label="Select size"
					options={sizeOptions}
					bind:value={size}
					orientation={selectedOrientation}
				/>

				<div class="subsection">
					<Heading level={4}>With Icons</Heading>
				</div>
				<RadioGroup
					name="payment-method"
					label="Payment method"
					options={paymentOptions}
					orientation={selectedOrientation}
				/>

				<div class="subsection">
					<Heading level={4}>Disabled</Heading>
				</div>
				<RadioGroup
					name="disabled-options"
					label="Disabled options"
					options={sizeOptions}
					disabled={disabledState}
					orientation={selectedOrientation}
				/>
			</div>

			<div class="section-spacing">
				<Divider />
			</div>

			<div class="small-spacing">
				<Heading level={4}>Props</Heading>
			</div>
			<Table columns={tableColumns} data={radioGroupProps} />
		</Card>
	</div>

	<!-- RangeSlider Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>RangeSlider</Heading>
			<Text color="muted">Numeric range selection with live value display</Text>

			<Divider />

			<div class="examples-grid">
				<Heading level={4}>Basic Slider</Heading>
				<RangeSlider label="Volume" min={0} max={100} bind:value={volume} showValue={true} />
				<div style="margin-top: 0.5rem;">
					<Text color="muted">Current value: {volume}</Text>
				</div>

				<div class="subsection">
					<Heading level={4}>Custom Range</Heading>
				</div>
				<RangeSlider label="Price range ($10-$50)" min={10} max={50} step={5} value={25} showValue={true} />

				<div class="subsection">
					<Heading level={4}>Without Value Display</Heading>
				</div>
				<RangeSlider label="Opacity" min={0} max={100} value={75} showValue={false} />

				<div class="subsection">
					<Heading level={4}>Disabled</Heading>
				</div>
				<RangeSlider label="Disabled slider" min={0} max={100} value={50} disabled={disabledState} />
			</div>

			<div class="section-spacing">
				<Divider />
			</div>

			<div class="small-spacing">
				<Heading level={4}>Props</Heading>
			</div>
			<Table columns={tableColumns} data={rangeSliderProps} />
		</Card>
	</div>

	<!-- InputGroup Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>InputGroup</Heading>
			<Text color="muted">Combine multiple inputs with seamless borders</Text>

			<Divider />

			<div class="examples-grid">
				<Heading level={4}>URL Input</Heading>
				<InputGroup>
					<div class="input-width-sm">
						<Input type="text" bind:value={protocol} placeholder="https://" />
					</div>
					<Input type="text" bind:value={domain} placeholder="example" />
					<div class="input-width-xs">
						<Input type="text" bind:value={tld} placeholder=".com" />
					</div>
				</InputGroup>

				<div class="subsection">
					<Heading level={4}>Price Input</Heading>
				</div>
				<InputGroup>
					<span class="input-addon">$</span>
					<Input type="number" bind:value={priceValue} placeholder="0" />
					<span class="input-addon">.00</span>
				</InputGroup>

				<div class="subsection">
					<Heading level={4}>Search with Button</Heading>
				</div>
				<InputGroup>
					<Input type="text" bind:value={searchQuery} placeholder="Search...">
						{#snippet iconBefore()}
							<Icon icon="lucide:search" width="18" />
						{/snippet}
					</Input>
					<Button variant="primary">
						<Icon icon="lucide:arrow-right" width="18" />
					</Button>
				</InputGroup>

				<div style="margin-top: 1rem;">
					<Text color="muted">
						InputGroup uses glass-panel styling and automatically merges borders between child elements.
					</Text>
				</div>
			</div>

			<div class="section-spacing">
				<Divider />
			</div>

			<div class="small-spacing">
				<Heading level={4}>Props</Heading>
			</div>
			<Table columns={tableColumns} data={inputGroupProps} />
		</Card>
	</div>

	<!-- FileUpload Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>FileUpload</Heading>
			<Text color="muted">File selection with drag-and-drop support and progress display</Text>

			<Divider />

			<div class="examples-grid">
				<Heading level={4}>Basic Upload</Heading>
				<FileUpload label="Upload Documents" accept="image/*" bind:files={uploadedFiles} />

				<div class="subsection">
					<Heading level={4}>Multiple Files</Heading>
				</div>
				<FileUpload label="Upload Multiple Images" accept="image/*" multiple={true} />

				<div class="subsection">
					<Heading level={4}>Custom Icon</Heading>
				</div>
				<FileUpload label="Upload to Cloud" accept="*/*">
					{#snippet icon()}
						<Icon icon="lucide:cloud-upload" width="32" />
					{/snippet}
				</FileUpload>

				<div class="subsection">
					<Heading level={4}>Disabled</Heading>
				</div>
				<FileUpload label="Disabled Upload" disabled={disabledState} />

				{#if uploadedFiles && uploadedFiles.length > 0}
					<div style="margin-top: 1rem;">
						<Text color="muted">Uploaded files (progress simulated for demo):</Text>
						{#each Array.from(uploadedFiles) as file}
							<div style="margin-top: 0.75rem;">
								<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
									<Text>
										{file.name}
									</Text>
									<Text color="muted">
										{(file.size / 1024).toFixed(2)} KB
									</Text>
								</div>
								<ProgressBar 
									value={fileProgress.get(file.name) ?? 0} 
									size="sm" 
									showLabel={true}
								/>
							</div>
						{/each}
					</div>
				{/if}

				<div style="margin-top: 1rem;">
					<Text color="muted">
						Drag and drop files or click to browse. The upload area shows an accent border and glow effect when dragging files over it. Upload progress is simulated for demonstration purposes.
					</Text>
				</div>
			</div>

			<div class="section-spacing">
				<Divider />
			</div>

			<div class="small-spacing">
				<Heading level={4}>Props</Heading>
			</div>
			<Table columns={tableColumns} data={fileUploadProps} />
		</Card>
	</div>

	<!-- Form Validation Demo Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>Form Validation Example</Heading>
			<Text color="muted">Complete form with validation and error states</Text>

			<Divider />

			<div style="margin-top: 2rem;">
				<Grid cols={1} gap="md">
					<Input
						type="email"
						label="Email"
						bind:value={email}
						error={emailError}
						placeholder="your@email.com"
					>
						{#snippet iconBefore()}
							<Icon icon="lucide:mail" width="18" />
						{/snippet}
					</Input>

					<Input
						type="password"
						label="Password (min 6 characters)"
						bind:value={password}
						error={passwordError}
						placeholder="Enter password"
					>
						{#snippet iconBefore()}
							<Icon icon="lucide:lock" width="18" />
						{/snippet}
					</Input>

					<Textarea
						label="Message"
						bind:value={message}
						error={messageError}
						rows={4}
						placeholder="Enter your message"
					>
						{#snippet iconBefore()}
							<Icon icon="lucide:message-square" width="18" />
						{/snippet}
					</Textarea>

					<Select
						label="Country"
						options={countryOptions}
						bind:value={country}
						error={showErrors && !country}
						placeholder="Select your country"
					>
						{#snippet iconBefore()}
							<Icon icon="lucide:globe" width="18" />
						{/snippet}
					</Select>

					<Checkbox 
						bind:checked={termsAccepted} 
						label="I accept the terms and conditions"
						onchange={() => { if (termsAccepted) termsError = false; }}
					/>
					{#if termsError}
						<div class="error-text">
							<Text color="error">You must accept the terms and conditions</Text>
						</div>
					{/if}

					<div style="display: flex; gap: 1rem; margin-top: 1rem;">
						<Button variant="primary" onclick={validateForm}>Validate Form</Button>
						<Button variant="secondary" onclick={resetForm}>Reset</Button>
					</div>

					{#if emailError || passwordError || messageError || termsError}
						<div class="error-text">
							<Text color="error">
								Please fix errors: 
								{emailError ? 'Invalid email. ' : ''}
								{passwordError ? 'Password too short. ' : ''}
								{messageError ? 'Message required. ' : ''}
								{termsError ? 'Terms required.' : ''}
							</Text>
						</div>
					{:else if email && password && message && termsAccepted}
						<div class="success-text">
							<Text color="muted">
								Form valid! ✓
							</Text>
						</div>
					{/if}
				</Grid>
			</div>
		</Card>
	</div>

	<!-- Component Relationships Diagram -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>Component Relationships</Heading>
			<Text color="muted">Visual overview of form component categories and data flow</Text>

			<Divider />

			<div style="margin-top: 2rem;">
				<pre style="background: var(--color-base-2); padding: 1.5rem; border-radius: var(--radius-lg); overflow-x: auto;"><code>{`graph TD
    A[Form Components] --> B[Text Inputs]
    A --> C[Selection]
    A --> D[Boolean]
    A --> E[Special]
    
    B --> B1[Input]
    B --> B2[Textarea]
    
    C --> C1[Select]
    C --> C2[RadioGroup]
    
    D --> D1[Checkbox]
    D --> D2[Switch]
    
    E --> E1[RangeSlider]
    E --> E2[FileUpload]
    E --> E3[InputGroup]
    
    B1 -.->|bind:value| F[State Management]
    B2 -.->|bind:value| F
    C1 -.->|bind:value| F
    C2 -.->|bind:value| F
    D1 -.->|bind:checked| F
    D2 -.->|bind:checked| F
    E1 -.->|bind:value| F
    E2 -.->|bind:files| F
    
    F --> G[Validation]
    G --> H[Error States]
    H -.->|error prop| B1
    H -.->|error prop| B2
    H -.->|error prop| C1`}</code></pre>
			</div>
		</Card>
	</div>

	<!-- Best Practices Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>Best Practices</Heading>

			<Divider />

			<div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
				<div>
					<div class="practice-title">Labels</div>
					<Text color="muted">Always provide labels for accessibility. Use the label prop or wrap inputs in a label element. Screen readers rely on proper labeling.</Text>
				</div>

				<div>
					<div class="practice-title">Error States</div>
					<Text color="muted">Show clear error messages near inputs. Use the error prop for visual indication. Provide helpful, specific error messages that guide users to fix issues.</Text>
				</div>

				<div>
					<div class="practice-title">Icons</div>
					<Text color="muted">Use iconBefore for context (search, email, globe) and iconAfter for actions (password visibility toggle, clear button). Icons should enhance understanding, not replace labels.</Text>
				</div>

				<div>
					<div class="practice-title">Validation</div>
					<Text color="muted">Validate on blur or submit, not on every keystroke. This prevents frustrating users with errors while they're still typing. Provide helpful error messages.</Text>
				</div>

				<div>
					<div class="practice-title">Disabled States</div>
					<Text color="muted">Clearly indicate disabled inputs with reduced opacity and cursor changes. Consider showing why an input is disabled (e.g., tooltip or help text).</Text>
				</div>

				<div>
					<div class="practice-title">File Upload</div>
					<Text color="muted">Provide clear accepted formats using the accept prop. Show upload progress for large files. Support both click and drag-drop interactions.</Text>
				</div>

				<div>
					<div class="practice-title">Accessibility</div>
					<Text color="muted">Ensure keyboard navigation works (Tab, Enter, Space). All components include proper ARIA attributes by default. Test with screen readers.</Text>
				</div>

				<div>
					<div class="practice-title">Grouping</div>
					<Text color="muted">Use InputGroup for related inputs (URL parts, price with currency). Use RadioGroup for mutually exclusive options. Group related checkboxes with fieldset/legend.</Text>
				</div>
			</div>
		</Card>
	</div>
</Container>

<style>
	.demo-section {
		margin-bottom: 3rem;
	}

	.controls-section {
		padding: 1.5rem;
		background: var(--color-base-2);
		border-radius: var(--radius-lg);
		margin-bottom: 2rem;
	}

	.examples-grid {
		margin-top: 2rem;
	}

	.feature-tag {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: var(--color-base-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.section-spacing {
		margin-top: 2rem;
	}

	.small-spacing {
		margin-top: 1rem;
	}

	.subsection {
		margin-top: 2rem;
	}

	.input-width-sm {
		max-width: 100px;
	}

	.input-width-xs {
		max-width: 80px;
	}

	.input-addon {
		padding: 0.5rem 1rem;
		background: var(--color-base-2);
		border: 1px solid var(--color-border);
		display: flex;
		align-items: center;
	}

	.error-text {
		color: var(--color-error);
	}

	.success-text {
		color: var(--color-success);
	}

	.practice-title {
		font-weight: 600;
		margin-bottom: 0.5rem;
	}
</style>
