import { mergeRefs } from '@solid-primitives/refs'
import {
	createEffect,
	createSignal,
	createUniqueId,
	mergeProps,
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

export interface TextFieldMultilineProps
	extends Omit<
			JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
			'onInvalid' | 'value'
		>,
		BaseTextFieldProps {}

export const TextFieldMultiline: Component<TextFieldMultilineProps> = props => {
	const merged = mergeProps(
		{ variant: 'outlined' } satisfies Partial<BaseTextFieldProps>,
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
	])

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

	let containerRef: HTMLDivElement | undefined
	let textareaRef: HTMLTextAreaElement | undefined

	const resize = () => {
		if (containerRef && textareaRef) {
			containerRef.style.height = 'unset'
			containerRef.style.height = `${textareaRef.scrollHeight}px`
		}
	}

	onMount(resize)

	const handleInvalid: JSX.EventHandler<HTMLTextAreaElement, Event> = e => {
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
			sharedStyles.multiLine,
			error() && styles.error,
			local.class,
		)
	}

	return (
		<div class={sharedStyles.rootContainer}>
			<div ref={containerRef} class={containerClass()}>
				<textarea
					{...others}
					aria-invalid={error() ? 'true' : 'false'}
					aria-describedby={error() ? `${inputId()}-st` : undefined}
					aria-labelledby={local.label ? `${inputId()}-st` : undefined}
					ref={mergeRefs(
						(el: HTMLTextAreaElement) => (textareaRef = el),
						local.ref,
					)}
					placeholder=" "
					on:input={resize}
					onInvalid={handleInvalid}
					id={inputId()}
					class={mergeClasses(sharedStyles.textArea, local.class)}
				/>
				<FieldContent
					styles={getStyles()}
					inputId={inputId()}
					multi
					{...merged}
				/>
			</div>
			<Show when={supportingText()}>
				<SupportingText
					text={supportingText()!}
					error={error()}
					id={`${inputId()}-st`}
				/>
			</Show>
		</div>
	)
}
