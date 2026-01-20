/// <reference types="vite/client" />

declare module 'solid-js' {
	namespace JSX {
		interface LabelHTMLAttributes<_T> {
			for?: string
		}
	}
}

export {}
