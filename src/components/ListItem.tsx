import { Show, splitProps } from 'solid-js'
import { mergeClasses } from '../utils'
import styles from './ListItem.module.css'
import type { JSX, JSXElement, ParentComponent } from 'solid-js'

export interface ListItemProps {
	leading?: JSXElement
	overline?: JSXElement
	headline?: JSXElement
	supporting?: JSXElement
	trailing?: JSXElement
	lines?: number
	href?: string
	onClick?: JSX.EventHandler<HTMLElement, MouseEvent>
	/**
	 * Whether to render the list item as a `<label>` element.
	 * Useful when the list item contains form elements.
	 */
	label?: boolean
	class?: string
}

export const ListItem: ParentComponent<ListItemProps> = props => {
	const [local, others] = splitProps(props, [
		'leading',
		'overline',
		'headline',
		'supporting',
		'trailing',
		'lines',
		'href',
		'onClick',
		'label',
		'class',
	])

	const computedLines = () =>
		local.lines ??
		(local.overline && local.supporting
			? 3
			: local.overline || local.supporting
				? 2
				: 1)

	const classNames = () =>
		mergeClasses(
			'm3-container',
			local.href || local.onClick ? 'm3-ripple' : undefined,
			styles.container,
			styles[`lines-${computedLines() > 3 ? '4-and-up' : computedLines()}`],
			local.class,
		)

	const renderContent = () => (
		<>
			<Show when={local.leading}>
				<div class={styles.leading}>{local.leading}</div>
			</Show>
			<div class={styles.body}>
				<Show when={local.overline}>
					<p class={styles.overline}>{local.overline}</p>
				</Show>
				<p class={styles.headline}>{local.headline}</p>
				<Show when={local.supporting}>
					<p class={styles.supporting}>{local.supporting}</p>
				</Show>
			</div>
			<Show when={local.trailing}>
				<div class={styles.trailing}>{local.trailing}</div>
			</Show>
		</>
	)

	return (
		<li style={{ display: 'contents' }}>
			<Show
				when={local.onClick}
				fallback={
					<Show
						when={local.href}
						fallback={
							<Show
								when={local.label}
								fallback={
									<div class={classNames()} {...others}>
										{renderContent()}
									</div>
								}
							>
								{/** biome-ignore lint/a11y/noLabelWithoutControl: Should be passed in ...others */}
								<label class={classNames()} {...others}>
									{renderContent()}
								</label>
							</Show>
						}
					>
						<a href={local.href} class={classNames()} {...others}>
							{renderContent()}
						</a>
					</Show>
				}
			>
				<button
					type="button"
					class={classNames()}
					onClick={local.onClick}
					{...others}
				>
					{renderContent()}
				</button>
			</Show>
		</li>
	)
}
