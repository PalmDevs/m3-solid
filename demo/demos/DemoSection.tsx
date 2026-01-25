import { Show } from 'solid-js'
import type { JSX, ParentComponent } from 'solid-js'

interface DemoSectionProps {
	title: string
	note?: JSX.Element
}

export const DemoSection: ParentComponent<DemoSectionProps> = props => {
	return (
		<section>
			<h2>{props.title}</h2>
			{props.children}
			<Show when={props.note}>
				<div class="demo-note">{props.note}</div>
			</Show>
		</section>
	)
}
