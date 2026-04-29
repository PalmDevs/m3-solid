import { mergeRefs } from '@solid-primitives/refs'
import {
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
import type { Component, ComponentProps, JSX, JSXElement } from 'solid-js'
import type { BaseTextFieldProps } from './shared'

export interface TextFieldProps
	extends Omit<ComponentProps<'input'>, 'onInvalid' | 'value'>,
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
		'ref',
		'onInput',
	])

	let input!: HTMLInputElement

	const [internalError, setInternalError] = createSignal(false)
	const [internalSupportingText, setInternalSupportingText] =
		createSignal<JSXElement>()

	const error = () => local.error ?? internalError()
	const supportingText = () => {
		if (local.error !== undefined) return local.supportingText
		if (internalError()) return internalSupportingText()
		return local.supportingText
	}

	onMount(() => {
		const form = input.form
		if (form) {
			function tryClearError() {
				if (input.checkValidity()) {
					setInternalError(false)
					setInternalSupportingText(undefined)
				}
			}

			form.addEventListener('submit', tryClearError)
			onCleanup(() => form.removeEventListener('submit', tryClearError))
		}
	})

	const generatedId = createUniqueId()
	const inputId = () => local.id ?? generatedId

	const handleInvalid: JSX.EventHandler<HTMLInputElement, Event> = e => {
		local.onInvalid?.(e.currentTarget.value, e.currentTarget.validationMessage)

		if (local.error === undefined) {
			setInternalError(true)
			setInternalSupportingText(e.currentTarget.validationMessage)
		}

		e.preventDefault()
	}

	const handleInput: JSX.InputEventHandler<
		HTMLInputElement,
		InputEvent
	> = e => {
		if (internalError() && e.currentTarget.checkValidity()) {
			setInternalError(false)
			setInternalSupportingText(undefined)
		}

		const onInput = local.onInput
		if (typeof onInput === 'function') {
			onInput(e)
		} else if (Array.isArray(onInput)) {
			onInput[0](onInput[1], e)
		}
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
					ref={mergeRefs(el => (input = el), local.ref)}
					aria-labelledby={local.label ? `${inputId()}-st` : undefined}
					aria-invalid={error() ? 'true' : 'false'}
					aria-describedby={error() ? `${inputId()}-st` : undefined}
					id={inputId()}
					class={mergeClasses(sharedStyles.textArea, local.class)}
					placeholder=" "
					onInput={handleInput}
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
