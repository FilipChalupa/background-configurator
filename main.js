import { renderer } from './renderer.js'

if (document.startViewTransition) {
	async function getPageContent(url) {
		const response = await fetch(url)
		const text = await response.text()
		return /<body[^>]*>([\w\W]*)<\/body>/.exec(text)[1]
	}

	async function onLinkNavigate(callback) {
		navigation.addEventListener('navigate', (event) => {
			const toUrl = new URL(event.destination.url)

			if (location.origin !== toUrl.origin) {
				return
			}
			event.intercept({
				async handler() {
					if (event.info === 'ignore') {
						return
					}
					await callback({
						toPath: toUrl.pathname,
					})
				},
			})
		})
	}

	onLinkNavigate(async ({ toPath }) => {
		const content = await getPageContent(toPath)

		document.startViewTransition(() => {
			document.body.innerHTML = content
			runPage()
		})
	})
}

const runOutputPage = () => {
	const urlParameters = new URLSearchParams(window.location.search)
	const title = urlParameters.get('title') ?? undefined

	const $output = document.querySelector('#output')
	const { render } = renderer((url) => {
		$output.src = url
	})
	render({
		title,
	})
}

const runMainPage = () => {
	const STORAGE_KEY = 'last-data'
	const $form = document.querySelector('form')
	const $preview = document.querySelector('#preview')
	const $download = document.querySelector('#download')
	const { render } = renderer((url) => {
		$preview.src = url
		$download.href = url
	})

	const persistFormData = () => {
		const formData = new FormData($form)
		const data = {}
		for (let [name, value] of formData.entries()) {
			data[name] = value
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
	}

	const updatePreview = () => {
		const formData = new FormData($form)
		const parameters = Object.fromEntries(formData.entries())
		render(parameters)
	}

	$form.addEventListener('submit', persistFormData)
	$form.addEventListener(
		'input',
		(() => {
			let timer
			return () => {
				persistFormData()
				clearTimeout(timer)
				timer = setTimeout(() => {
					updatePreview()
				}, 500)
			}
		})(),
	)

	try {
		const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
		for (let [name, value] of Object.entries(data)) {
			const $field = $form.querySelector(`[name="${name}"]`)
			if ($field === null) {
				continue
			}
			if ($field.type === 'checkbox') {
				$field.checked = true
			} else if (!$field.value) {
				$field.value = value
			}
		}
	} catch (error) {
		console.error(error)
	}
	updatePreview()
}

const runPage = () => {
	if (document.querySelector('#output')) {
		runOutputPage()
	} else if (document.querySelector('#main-page')) {
		runMainPage()
	}
}

runPage()

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('serviceWorker.js')
}
