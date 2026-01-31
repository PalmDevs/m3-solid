import ErrorIcon from '@iconify-icons/mdi/error'
import { Show } from 'solid-js'
import { mergeClasses } from '../../utils'
import { Icon } from '../Icon'
import sharedStyles from './shared.module.css'
import type { IconifyIcon } from '@iconify/types'
import type { JSX } from 'solid-js'

export type TextFieldVariant = 'outlined' | 'filled'

export interface BaseTextFieldProps {
	label: string
	/**
	 * If `true`, the text field will be displayed in an error state.
	 *
	 * If `undefined`, the error state will be automatically handled based on browser validation.
	 */
	error?: boolean
	value?: string
	supportingText?: string
	variant?: TextFieldVariant
	/**
	 * Callback fired when the input is invalid. Error states are usually automatically handled.
	 *
	 * To control the error state, pass {@link BaseTextFieldProps.error} with a boolean value.
	 *
	 * @param value The value of the input field
	 * @param msg The validation message
	 */
	onInvalid?: (value: string, msg: string) => void
	leadingIcon?: IconifyIcon
	errorIcon?: IconifyIcon | boolean
	trailing?: {
		icon: IconifyIcon
		onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
	}
}

export const SupportingText = (props: {
	text: string
	error?: boolean
	id: string
}) => {
	return (
		<p
			id={props.id}
			class={mergeClasses(
				'm3-body-small',
				sharedStyles.supportingText,
				props.error && sharedStyles.error,
			)}
		>
			{props.text}
		</p>
	)
}

export const FieldContent = (
	props: BaseTextFieldProps & {
		inputId: string
		multi?: boolean
		styles: Record<string, string>
	},
) => {
	return (
		<>
			<div class={props.styles.layer}></div>
			{/* @ts-expect-error: Bad types */}
			<label class={sharedStyles.labelBase} for={props.inputId}>
				{props.label}
			</label>
			<Show when={props.leadingIcon}>
				<Icon
					size={24}
					icon={props.leadingIcon!}
					class={`${sharedStyles.leading} ${sharedStyles.icon}`}
				/>
			</Show>
			<div class={sharedStyles.trailing}>
				<Show when={props.trailing}>
					{/* TODO: Replace with IconButton */}
					<button
						type="button"
						class={`${sharedStyles.action} ${sharedStyles.icon}`}
						onClick={props.trailing!.onClick}
					>
						<div class="m3-ripple">
							<Icon
								size={24}
								class={sharedStyles.icon}
								icon={props.trailing!.icon}
							/>
						</div>
					</button>
				</Show>
				<Show
					when={props.errorIcon !== false && !props.trailing && props.error}
				>
					<div class={sharedStyles.iconContainer}>
						<Icon
							size={24}
							icon={
								typeof props.errorIcon === 'object'
									? props.errorIcon
									: ErrorIcon
							}
							class={`${sharedStyles.icon} ${sharedStyles.error}`}
						/>
					</div>
				</Show>
			</div>
		</>
	)
}
