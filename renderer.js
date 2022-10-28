export const renderer = ($canvas, onUrlChange = () => {}) => {
	const width = 1920
	const height = 1080
	$canvas.width = width
	$canvas.height = height
	const fontFamily = 'Open Sans'
	const context = $canvas.getContext('2d')
	const background = new Image(width, height)
	let parameters = {}

	background.addEventListener('load', () => {
		render(parameters)
	})
	background.src = 'background.jpg'

	document.fonts.ready.then(function () {
		if (document.fonts.check(`1em ${fontFamily}`)) {
			render(parameters)
		}
	})

	const setFont = (size, isBold) => {
		context.font = `${
			isBold ? 'bold' : 'normal'
		} ${size}px ${fontFamily}, sans-serif`
	}

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

		context.fillStyle = '#ffffff'

		setFont(94, true)
		title
			.toLocaleUpperCase('cs')
			.split('\n')
			.forEach((line, i, lines) => {
				const lineHeight = 112
				context.fillText(line, 99, 652 - (lines.length - i - 1) * lineHeight) // @TODO multiline
			})
		setFont(46, false)
		context.fillText(meta1, 99, 740)
		context.fillText(meta2, 99, 814)
		context.fillText(meta3, 99, 890)

		onUrlChange($canvas.toDataURL('image/jpeg'))
	}

	return {
		render,
	}
}

// @TODO: zobrazit ikonku
// @TODO: podpora pro multiline title
// @TODO: překontrolovat jednotné zarovnání k levé hraně
