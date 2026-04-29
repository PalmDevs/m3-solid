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

export interface TextFieldMultilineProps
	extends Omit<ComponentProps<'textarea'>, 'onInvalid' | 'value'>,
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
		'onInput',
	])

	const [internalError, setInternalError] = createSignal(false)
	const [internalSupportingText, setInternalSupportingText] =
		createSignal<JSXElement>()

	const error = () => local.error ?? internalError()
	const supportingText = () => {
		if (local.error !== undefined) return local.supportingText
		if (internalError()) return internalSupportingText()
		return local.supportingText
	}

	const generatedId = createUniqueId()
	const inputId = () => local.id ?? generatedId

	let containerRef: HTMLDivElement | undefined
	let textareaRef: HTMLTextAreaElement | undefined

	const resize = () => {
		if (containerRef && textareaRef) {
			containerRef.style.height = 'unset'
			containerRef.style.height = `${textareaRef.scrollHeight}px`
		}
	}

	onMount(() => {
		resize()
		const form = textareaRef?.form
		if (form) {
			function tryClearError() {
				if (textareaRef?.checkValidity()) {
					setInternalError(false)
					setInternalSupportingText(undefined)
				}
			}

			form.addEventListener('submit', tryClearError)
			onCleanup(() => form.removeEventListener('submit', tryClearError))
		}
	})

	const handleInvalid: JSX.EventHandler<HTMLTextAreaElement, Event> = e => {
		local.onInvalid?.(e.currentTarget.value, e.currentTarget.validationMessage)

		if (local.error === undefined) {
			setInternalError(true)
			setInternalSupportingText(e.currentTarget.validationMessage)
		}

		e.preventDefault()
	}

	const handleInput: JSX.InputEventHandler<
		HTMLTextAreaElement,
		InputEvent
	> = e => {
		resize()
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
					onInput={handleInput}
					onInvalid={handleInvalid}
					id={inputId()}
					class={mergeClasses(sharedStyles.textArea, local.class)}
				/>
				<FieldContent
					styles={getStyles()}
					inputId={inputId()}
					multi
					{...local}
					error={error()}
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
