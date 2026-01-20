import { render } from 'solid-js/web'
import '../src/styles.css'
import '../src/themes/default.css'
import './demo.css'
import {
	ButtonsDemo,
	CardsDemo,
	ChipDemo,
	DialogDemo,
	FABDemo,
	InteractiveCardDemo,
	ListItemDemo,
	LoadingIndicatorDemo,
	MenuDemo,
	ProgressDemo,
	SwitchDemo,
	TabsDemo,
	TextFieldDemo,
} from './demos'

function App() {
	return (
		<div class="demo-container">
			<header>
				<h1>M3 Solid</h1>
				<p>Material Design 3 Components for SolidJS</p>
			</header>

			<main>
				<ButtonsDemo />
				<FABDemo />
				<CardsDemo />
				<InteractiveCardDemo />
				<SwitchDemo />
				<DialogDemo />
				<MenuDemo />
				<ChipDemo />
				<TabsDemo />
				<ListItemDemo />
				<TextFieldDemo />
				<ProgressDemo />
				<LoadingIndicatorDemo />
			</main>
		</div>
	)
}

const root = document.getElementById('root')
if (root) {
	render(() => <App />, root)
}
