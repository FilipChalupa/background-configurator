export const renderer = ($canvas, onUrlChange = () => {}) => {
	const width = 1920
	const height = 1080
	$canvas.width = width
	$canvas.height = height
	const context = $canvas.getContext('2d')
	const background = new Image(width, height)
	let parameters = {}

	background.addEventListener('load', () => {
		render(parameters)
	})
	background.src = 'background.jpg'

	const render = ({
		title = '',
		meta1 = '',
		meta2 = '',
		meta3 = '',
		iconUrl = '',
	}) => {
		parameters = {
			title,
			meta1,
			meta2,
			meta3,
			iconUrl,
		}
		context.fillStyle = '#222262'
		context.fillRect(0, 0, width, height)

		const isBackgroundLoaded =
			background.complete && background.naturalHeight !== 0
		if (isBackgroundLoaded) {
			context.drawImage(background, 0, 0)
		}

		onUrlChange($canvas.toDataURL('image/png'))
	}

	return {
		render,
	}
}
