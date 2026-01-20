import CloseIcon from '@iconify-icons/mdi/close'
import SearchIcon from '@iconify-icons/mdi/search'
import { createSignal } from 'solid-js'
import { TextField } from '../../src/components/text-field/TextField'
import { TextFieldMultiline } from '../../src/components/text-field/TextFieldMultiline'
import { DemoSection } from './DemoSection'
import type { Component, JSX } from 'solid-js'

export const TextFieldDemo: Component = () => {
	const [filledValue, setFilledValue] = createSignal('')
	const [outlinedValue, setOutlinedValue] = createSignal('')
	const [multilineValue, setFilledMultilineValue] = createSignal('')
	const [outlinedMultilineValue, setOutlinedMultilineValue] = createSignal('')
	const [errorValue, setErrorValue] = createSignal('')

	type ChangeHandler = JSX.ChangeEventHandler<
		HTMLInputElement | HTMLTextAreaElement,
		InputEvent
	>

	const handleFilledValueChange: ChangeHandler = e =>
		setFilledValue(e.currentTarget.value)
	const handleOutlinedValueChange: ChangeHandler = e =>
		setOutlinedValue(e.currentTarget.value)
	const handleFilledMultilineValueChange: ChangeHandler = e =>
		setFilledMultilineValue(e.currentTarget.value)
	const handleOutlinedMultilineValueChange: ChangeHandler = e =>
		setOutlinedMultilineValue(e.currentTarget.value)
	const handleErrorValueChange: ChangeHandler = e =>
		setErrorValue(e.currentTarget.value)

	const hasError = () => errorValue().length < 1

	return (
		<>
			<DemoSection title="Filled Text Fields">
				<div
					style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem' }}
				>
					<TextField
						variant="filled"
						label="Simple field"
						value={filledValue()}
						onInput={handleFilledValueChange}
					/>
					<TextField
						variant="filled"
						label="With leading icon"
						leadingIcon={SearchIcon}
						value={filledValue()}
						onInput={handleFilledValueChange}
					/>
					<TextField
						variant="filled"
						label="With trailing icon"
						trailing={{
							icon: CloseIcon,
							onClick: () => setFilledValue(''),
						}}
						value={filledValue()}
						onInput={handleFilledValueChange}
					/>
					<TextField
						variant="filled"
						label="Error state"
						error={hasError()}
						value={errorValue()}
						onInput={handleErrorValueChange}
						supportingText="Cannot be empty"
					/>
					<TextField
						variant="filled"
						label="Disabled"
						disabled
						value="Disabled text"
					/>
				</div>
			</DemoSection>

			<DemoSection title="Filled Multiline Text Fields">
				<div
					style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem' }}
				>
					<TextFieldMultiline
						variant="filled"
						label="Multiline field"
						value={multilineValue()}
						onInput={handleFilledMultilineValueChange}
						placeholder="Type multiple lines..."
					/>
					<TextFieldMultiline
						variant="filled"
						label="With leading icon"
						leadingIcon={SearchIcon}
						value={multilineValue()}
						onInput={handleFilledMultilineValueChange}
					/>
				</div>
			</DemoSection>

			<DemoSection title="Outlined Text Fields">
				<div
					style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem' }}
				>
					<TextField
						label="Simple field"
						value={outlinedValue()}
						onInput={handleOutlinedValueChange}
					/>
					<TextField
						label="With leading icon"
						leadingIcon={SearchIcon}
						value={outlinedValue()}
						onInput={handleOutlinedValueChange}
					/>
					<TextField
						label="With trailing icon"
						trailing={{
							icon: CloseIcon,
							onClick: () => setOutlinedValue(''),
						}}
						value={outlinedValue()}
						onInput={handleOutlinedValueChange}
					/>
					<TextField
						label="Error state"
						error={hasError()}
						value={errorValue()}
						onInput={handleErrorValueChange}
						supportingText="Cannot be empty"
					/>
					<TextField
						variant="filled"
						label="Disabled"
						disabled
						value="Disabled text"
					/>
				</div>
			</DemoSection>

			<DemoSection title="Outlined Multiline Text Fields">
				<div
					style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem' }}
				>
					<TextFieldMultiline
						label="Multiline field"
						value={outlinedMultilineValue()}
						onInput={handleOutlinedMultilineValueChange}
						placeholder="Type multiple lines..."
					/>
					<TextFieldMultiline
						label="With leading icon"
						leadingIcon={SearchIcon}
						value={outlinedMultilineValue()}
						onInput={handleOutlinedMultilineValueChange}
					/>
				</div>
			</DemoSection>
		</>
	)
}
