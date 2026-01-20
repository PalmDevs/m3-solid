import { mergeRefs } from '@solid-primitives/refs'
import {
	createEffect,
	createSignal,
	createUniqueId,
	mergeProps,
	onCleanup,
	onMount,
	Show,
	splitProps,
} from 'solid-js'
import { mergeClasses } from '../../utils'
import filledStyles from './FilledTextField.module.css'
import outlinedStyles from './OutlinedTextField.module.css'
import { FieldContent, SupportingText } from './shared'
import sharedStyles from './shared.module.css'
import type { Component, JSX } from 'solid-js'
import type { BaseTextFieldProps } from './shared'

export interface TextFieldProps
	extends Omit<
			JSX.InputHTMLAttributes<HTMLInputElement>,
			'onInvalid' | 'value'
		>,
		BaseTextFieldProps {}

export const TextField: Component<TextFieldProps> = props => {
	const merged = mergeProps(
		{
			variant: 'outlined',
			errorIcon: true,
		} satisfies Partial<BaseTextFieldProps>,
		props,
	)

	const [local, others] = splitProps(merged, [
		'label',
		'leadingIcon',
		'trailing',
		'error',
		'class',
		'variant',
		'onInvalid',
		'id',
		'supportingText',
	])

	let input!: HTMLInputElement

	onMount(() => {
		const form = input.form
		if (form) {
			function tryClearError() {
				if (input.reportValidity()) {
					if (!isErrorControlled()) {
						setError(false)
						setSupportingText(props.supportingText)
					}
				}
			}

			form.addEventListener('submit', tryClearError)
			onCleanup(() => form.removeEventListener('submit', tryClearError))
		} else
			console.warn(
				'TextField is not inside a form element. This is likely not intended.',
			)
	})

	// Whether we should be controlling the states internally
	const isErrorControlled = () => props.error !== undefined
	const isSupportingTextControlled = () => props.supportingText !== undefined

	const [supportingText, setSupportingText] = createSignal(props.supportingText)
	const [error, setError] = createSignal(props.error)

	createEffect(() => {
		if (isSupportingTextControlled() && isErrorControlled())
			setSupportingText(props.supportingText)
	})

	createEffect(() => {
		if (isErrorControlled()) setError(props.error)
	})

	const generatedId = createUniqueId()
	const inputId = () => props.id ?? generatedId

	const handleInvalid: JSX.EventHandler<HTMLInputElement, Event> = e => {
		props.onInvalid?.(e.currentTarget.value, e.currentTarget.validationMessage)

		if (!isErrorControlled()) {
			setError(true)
			setSupportingText(e.currentTarget.validationMessage)
		}

		const input = e.currentTarget
		requestIdleCallback(() => {
			// Make it valid to the browser so the user can resubmit
			input.setCustomValidity('')
		})

		e.preventDefault()
	}

	const getStyles = () =>
		local.variant === 'filled' ? filledStyles : outlinedStyles

	const containerClass = () => {
		const styles = getStyles()
		return mergeClasses(
			styles.container,
			sharedStyles.containerBase,
			sharedStyles.singleLine,
			error() && styles.error,
			local.class,
		)
	}

	return (
		<div class={sharedStyles.rootContainer}>
			<div class={containerClass()}>
				<input
					{...others}
					ref={mergeRefs(el => (input = el), props.ref)}
					aria-labelledby={local.label ? `${inputId()}-st` : undefined}
					aria-invalid={error() ? 'true' : 'false'}
					aria-describedby={error() ? `${inputId()}-st` : undefined}
					id={inputId()}
					class={mergeClasses(sharedStyles.textArea, local.class)}
					placeholder=" "
					onInvalid={handleInvalid}
				/>
				<FieldContent
					styles={getStyles()}
					inputId={inputId()}
					{...local}
					error={error()}
				/>
			</div>
			<Show when={supportingText()}>
				<SupportingText
					id={`${inputId()}-st`}
					text={supportingText()!}
					error={error()}
				/>
			</Show>
		</div>
	)
}
