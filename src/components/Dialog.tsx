import { mergeRefs } from '@solid-primitives/refs'
import { createEffect, Show, splitProps } from 'solid-js'
import { parseDuration } from '../animation'
import { mergeClasses } from '../utils'
import styles from './Dialog.module.css'
import type { JSX, JSXElement, ParentComponent } from 'solid-js'

export interface DialogProps {
	headline?: JSXElement
	/**
	 * If `true`, centers the headline text.
	 *
	 * Dialogs with icons will have centered headlines by default.
	 *
	 * @default false
	 */
	centerHeadline?: boolean
	icon?: JSXElement
	open?: boolean
	onOpenChange?: (open: boolean) => void
	closedBy?: 'any' | 'none'
	actions: JSXElement
	class?: string
	quick?: boolean
	backdropProps?: JSX.HTMLAttributes<HTMLDivElement>
}

const cancelAnimations = (...elements: HTMLElement[]) => {
	for (const el of elements) {
		el.getAnimations().forEach(anim => anim.cancel())
	}
}

const animateOpen = async (
	dialog: HTMLDialogElement,
	buttonsEl: HTMLElement,
	backdropEl: HTMLElement,
): Promise<void> => {
	const computedStyle = getComputedStyle(dialog)

	const dialogShape =
		computedStyle.getPropertyValue('--m3-dialog-shape').trim() ||
		computedStyle.getPropertyValue('--m3-shape-extra-large').trim()

	const fastTimingFunction = computedStyle
		.getPropertyValue('--m3-timing-function-fast')
		.trim()
	const fastDuration = parseDuration(
		computedStyle.getPropertyValue('--m3-duration-fast'),
	)
	const emphasizedTimingFunction = computedStyle
		.getPropertyValue('--m3-timing-function-emphasized')
		.trim()
	const animDuration = parseDuration(
		computedStyle.getPropertyValue('--m3-dialog-animation-duration') ||
			computedStyle.getPropertyValue('--m3-duration-spatial'),
	)

	const closedClipPath = `inset(0 0 75% 0 round ${dialogShape})`
	const openClipPath = `inset(0 0 0 0 round ${dialogShape})`

	// Animate opacity with fast easing
	const opacityAnimation = dialog.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: fastDuration,
		easing: fastTimingFunction,
		fill: 'forwards',
	})

	// Animate transform with emphasized easing
	const transformAnimation = dialog.animate(
		[
			{ transform: 'translateY(-3rem) scaleY(90%)' },
			{ transform: 'translateY(0) scaleY(100%)' },
		],
		{
			duration: animDuration,
			easing: emphasizedTimingFunction,
			fill: 'forwards',
		},
	)

	// Animate clip-path with emphasized easing
	const clipPathAnimation = dialog.animate(
		[{ clipPath: closedClipPath }, { clipPath: openClipPath }],
		{
			duration: animDuration,
			easing: emphasizedTimingFunction,
			fill: 'forwards',
		},
	)

	// Animate backdrop
	const backdropAnimation = backdropEl.animate(
		[{ opacity: 0 }, { opacity: 1 }],
		{ duration: fastDuration, easing: fastTimingFunction, fill: 'forwards' },
	)

	// Animate buttons
	const buttonsAnimation = buttonsEl.animate(
		[
			{ opacity: 0, transform: 'translateY(-4rem)' },
			{ opacity: 0, offset: 0.25 },
			{ opacity: 1, transform: 'translateY(0)' },
		],
		{
			delay: animDuration * 0.1,
			duration: animDuration,
			easing: emphasizedTimingFunction,
			fill: 'forwards',
		},
	)

	await Promise.all([
		opacityAnimation.finished,
		transformAnimation.finished,
		clipPathAnimation.finished,
		backdropAnimation.finished,
		buttonsAnimation.finished,
	])
}

const animateClose = async (
	dialog: HTMLDialogElement,
	buttonsEl: HTMLElement,
	backdropEl: HTMLElement,
): Promise<void> => {
	const computedStyle = getComputedStyle(dialog)

	const dialogShape =
		computedStyle.getPropertyValue('--m3-dialog-shape').trim() ||
		computedStyle.getPropertyValue('--m3-shape-extra-large').trim()

	const fastTimingFunction = computedStyle
		.getPropertyValue('--m3-timing-function-fast')
		.trim()
	const fastDuration = parseDuration(
		computedStyle.getPropertyValue('--m3-duration-fast'),
	)

	const openClipPath = `inset(0 0 0 0 round ${dialogShape})`
	const closedClipPath = `inset(0 0 75% 0 round ${dialogShape})`

	// All properties use fast easing for closing
	const opacityAnimation = dialog.animate([{ opacity: 1 }, { opacity: 0 }], {
		duration: fastDuration,
		easing: fastTimingFunction,
		fill: 'forwards',
	})

	const transformAnimation = dialog.animate(
		[
			{ transform: 'translateY(0) scaleY(100%)' },
			{ transform: 'translateY(-3rem) scaleY(90%)' },
		],
		{ duration: fastDuration, easing: fastTimingFunction, fill: 'forwards' },
	)

	const clipPathAnimation = dialog.animate(
		[{ clipPath: openClipPath }, { clipPath: closedClipPath }],
		{ duration: fastDuration, easing: fastTimingFunction, fill: 'forwards' },
	)

	// Animate backdrop
	const backdropAnimation = backdropEl.animate(
		[{ opacity: 1 }, { opacity: 0 }],
		{ duration: fastDuration, easing: fastTimingFunction, fill: 'forwards' },
	)

	const buttonsAnimation = buttonsEl.animate(
		[
			{ opacity: 1, transform: 'translateY(0)' },
			{ opacity: 0, transform: 'translateY(-3rem)' },
		],
		{ duration: fastDuration, easing: fastTimingFunction, fill: 'forwards' },
	)

	await Promise.all([
		opacityAnimation.finished,
		transformAnimation.finished,
		clipPathAnimation.finished,
		backdropAnimation.finished,
		buttonsAnimation.finished,
	])
}

export const Dialog: ParentComponent<DialogProps> = props => {
	let dialogRef: HTMLDialogElement | undefined
	let buttonsRef: HTMLDivElement | undefined
	let backdropRef: HTMLDivElement | undefined
	const [local, others] = splitProps(props, [
		'headline',
		'icon',
		'open',
		'onOpenChange',
		'closedBy',
		'actions',
		'children',
		'class',
		'centerHeadline',
		'quick',
		'backdropProps',
	])

	const shouldAnimate = () => {
		if (matchMedia('(prefers-reduced-motion:reduce)').matches) return false
		if (local.quick) return false

		return true
	}

	createEffect(
		async () => {
			if (local.open) {
				if (!dialogRef || !backdropRef) return

				dialogRef.showModal()

				if (shouldAnimate()) {
					await animateOpen(dialogRef, buttonsRef!, backdropRef)
				} else {
					// Cancel any running animations (in case props.quick was toggled for some reason)
					cancelAnimations(dialogRef, buttonsRef!, backdropRef)
				}
			} else {
				await handleClose()
			}
		},
		{ defer: true },
	)

	const handleToggle = (e: Event) => {
		const dialog = e.target as HTMLDialogElement
		local.onOpenChange?.(dialog.open)
	}

	const handleClose = async () => {
		if (!dialogRef || !dialogRef.open || !backdropRef) return

		if (shouldAnimate()) {
			await animateClose(dialogRef, buttonsRef!, backdropRef)
		} else {
			cancelAnimations(dialogRef, buttonsRef!, backdropRef)
		}

		dialogRef.close()
	}

	const getClasses = () =>
		mergeClasses(
			'm3-container',
			styles.container,
			(local.centerHeadline ?? local.icon) && styles.headlineCenter,
			local.class,
		)

	return (
		<>
			<div
				{...local.backdropProps}
				ref={mergeRefs(el => (backdropRef = el), local.backdropProps?.ref)}
				class={mergeClasses(styles.backdrop, local.backdropProps?.class)}
			/>
			<dialog
				ref={dialogRef}
				on:cancel={e => {
					e.preventDefault()
					handleClose()
				}}
				class={getClasses()}
				onToggle={handleToggle}
				closedby={local.closedBy}
				role="alertdialog"
				{...others}
			>
				<Show when={local.icon}>
					<div class={styles.icon}>{local.icon}</div>
				</Show>
				<Show when={local.headline}>
					<h1
						class={mergeClasses(
							styles.headline,
							'm3-headline-small',
							local.icon && styles.center,
						)}
					>
						{local.headline}
					</h1>
				</Show>
				<div class={mergeClasses(styles.content, 'm3-body-medium')}>
					{local.children}
				</div>
				<div ref={buttonsRef} class={styles.buttons}>
					{local.actions}
				</div>
			</dialog>
		</>
	)
}
