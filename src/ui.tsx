import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useState, useEffect } from 'react'
import './figma-plugin-ds.min.css'
import './scss/main.scss'
import { SelectOptions, SelectVisual } from './ui/selectVisual'
import Create from './ui/Create'
import { InputIcon } from './ui/Form'

const manifest = require('./../package.json')
const logo = require('./logo.svg')

let settingsDefault: SettingData = {
	verticalAlign: 0.5,
	horizontalAlign: 0.5,
	spacing: 20,
	count: 5,
	autoWidth: true,
	totalLength: 0,
	isLoop: false,
	objWidth: 0,
	offset: 0,
	rotCheck: true,
	precision: 420
}


// main ui component
function UI() {
	const [selection, showselection] = useState('nothing')
	const [about, showabout] = useState(false)
	const [setting, setSetting] = useState(settingsDefault)
	const [link, setLink] = useState(false)

	useEffect(() => {
		// Update the document title using the browser API
		if (link) {
			parent.postMessage(
				{
					pluginMessage: {
						type: 'do-the-thing',
						options: setting
					}
				},
				'*'
			)
		}
	  }, [setting]);
	
	const onCreate = () => {
		parent.postMessage(
			{
				pluginMessage: {
					type: 'initial-link',
					options: setting
				}
			},
			'*'
		)
	
	}

	onmessage = event => {
		let eventData = event.data.pluginMessage
		switch (eventData.type) {
			case 'svg':
			case 'selection':
				
				const svgdata = event.data.pluginMessage.svgdata

				let copy: SettingData
				if (eventData.data.setting != null) {
					copy = { ...eventData.data.setting }
				} else {
					copy = {...setting}
				}


				if (svgdata != null && svgdata != undefined) {
					if (svgdata!= null && svgdata != '') {
						const width = event.data.pluginMessage.width
						let path = document.createElementNS(
							'http://www.w3.org/2000/svg',
							'path'
						)
						path.setAttribute('d', svgdata)

						const isLoop: boolean = svgdata.toUpperCase().includes('Z')

						// use the builtin function getTotalLength() to calculate length
						const svglength = path.getTotalLength()
						// change the spacing number on "auto width" setting (space evenly thru whole thing)
						if (svglength != 0 && setting.autoWidth) {
							
							const space = isLoop
								? svglength / setting.count - width
								: svglength / (setting.count - 1) - width

							copy = { ...copy, spacing: space }
						}
						copy = {
							...copy,
							totalLength: svglength,
							isLoop: isLoop,
							objWidth: width
						}
					}
				}

				if (eventData.value === 'text') {
					copy = { ...copy, autoWidth: false }
				}
				setSetting({...copy})
				if (eventData.data.setting != null) {
					setLink(true)
				}
				if (eventData.data.type === "text" ) {
					showselection("text")
		
				} else {
					showselection("clone")
				}
				break
				default :
				showselection(eventData.value)
				setLink(false)

				break
		}
		
	}

	return (
		<div>
			<div className={about === true ? 'about' : 'about hidden'}>
				<div className="flex-about">
					<img src={logo} className="logo"></img>
					<svg
						className="logotext"
						width="131"
						height="30"
						viewBox="0 0 131 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M0.949219 13.2324C1.01953 12.6113 1.05469 11.75 1.05469 10.6484C1.05469 8.55078 0.972656 6.17188 0.808594 3.51172C3.09375 3.58203 7.01953 3.61719 12.5859 3.61719C18.1289 3.61719 22.0371 3.58203 24.3105 3.51172C24.1465 6.17188 24.0645 8.55078 24.0645 10.6484C24.0645 11.75 24.0996 12.6113 24.1699 13.2324H23.3438C22.5586 10.0801 21.5391 7.8125 20.2852 6.42969C19.043 5.03516 17.7012 4.33789 16.2598 4.33789H16.2246V24.9395C16.2246 25.9473 16.3242 26.6797 16.5234 27.1367C16.7344 27.5938 17.1094 27.8984 17.6484 28.0508C18.1875 28.2031 19.043 28.2793 20.2148 28.2793V29C16.8398 28.9297 14.209 28.8945 12.3223 28.8945C10.623 28.8945 8.15625 28.9297 4.92188 29V28.2793C6.09375 28.2793 6.94922 28.2031 7.48828 28.0508C8.02734 27.8984 8.39648 27.5938 8.5957 27.1367C8.80664 26.6797 8.91211 25.9473 8.91211 24.9395V4.33789H8.87695C7.41211 4.33789 6.05859 5.0293 4.81641 6.41211C3.58594 7.7832 2.57227 10.0566 1.77539 13.2324H0.949219ZM34.084 9.80469C37.0371 9.80469 39.3164 10.584 40.9219 12.1426C42.5273 13.6895 43.3301 16.2031 43.3301 19.6836C43.3301 23.1523 42.5273 25.6602 40.9219 27.207C39.3164 28.7422 37.0371 29.5098 34.084 29.5098C31.1191 29.5098 28.834 28.7422 27.2285 27.207C25.623 25.6602 24.8203 23.1523 24.8203 19.6836C24.8203 16.2031 25.623 13.6895 27.2285 12.1426C28.8457 10.584 31.1309 9.80469 34.084 9.80469ZM34.084 10.5254C33.3223 10.5254 32.707 11.2812 32.2383 12.793C31.7812 14.3047 31.5527 16.6016 31.5527 19.6836C31.5527 22.7539 31.7812 25.0391 32.2383 26.5391C32.707 28.0391 33.3223 28.7891 34.084 28.7891C34.8457 28.7891 35.4551 28.0391 35.9121 26.5391C36.3691 25.0391 36.5977 22.7539 36.5977 19.6836C36.5977 16.6016 36.3691 14.3047 35.9121 12.793C35.4551 11.2812 34.8457 10.5254 34.084 10.5254ZM63.3691 24.8164C63.3691 25.8242 63.4688 26.5625 63.668 27.0312C63.8789 27.4883 64.2539 27.793 64.793 27.9453C65.3438 28.0977 66.2051 28.1738 67.377 28.1738V29C64.1426 28.9297 61.6699 28.8945 59.959 28.8945C59.5605 28.8945 57.4102 28.9297 53.5078 29V28.2793C54.2812 28.2441 54.8379 28.1504 55.1777 27.998C55.5293 27.8457 55.7637 27.5645 55.8809 27.1543C56.0098 26.7441 56.0742 26.0879 56.0742 25.1855V7.32617C56.0742 6.42383 56.0098 5.76758 55.8809 5.35742C55.752 4.94727 55.5117 4.66602 55.1602 4.51367C54.8203 4.36133 54.2695 4.26758 53.5078 4.23242V3.51172C54.8789 3.58203 56.9473 3.61719 59.7129 3.61719C60.6973 3.61719 61.793 3.60547 63 3.58203C64.207 3.55859 65.0391 3.54688 65.4961 3.54688C67.875 3.54688 69.873 3.8457 71.4902 4.44336C73.1191 5.0293 74.332 5.85547 75.1289 6.92188C75.9375 7.98828 76.3418 9.23047 76.3418 10.6484C76.3418 11.9727 75.9844 13.2441 75.2695 14.4629C74.5547 15.6699 73.3301 16.6777 71.5957 17.4863C69.8613 18.2949 67.5645 18.6992 64.7051 18.6992H63.3691V24.8164ZM64.3535 17.9785C66.041 17.9785 67.2012 17.3574 67.834 16.1152C68.4668 14.8613 68.7832 13.168 68.7832 11.0352C68.7832 8.70312 68.5137 6.98633 67.9746 5.88477C67.4473 4.7832 66.5625 4.23242 65.3203 4.23242C64.7695 4.23242 64.3535 4.32031 64.0723 4.49609C63.8027 4.66016 63.6152 4.95898 63.5098 5.39258C63.416 5.82617 63.3691 6.4707 63.3691 7.32617V17.9785H64.3535ZM86.748 13.4785C86.748 12.7168 86.5547 12.0371 86.168 11.4395C85.793 10.8301 85.0957 10.5254 84.0762 10.5254C83.7715 10.5254 83.4434 10.584 83.0918 10.7012C82.752 10.8184 82.4473 10.9648 82.1777 11.1406C83.7832 11.7383 84.5859 12.8223 84.5859 14.3926C84.5859 14.9551 84.4395 15.4648 84.1465 15.9219C83.8652 16.3789 83.4609 16.7422 82.9336 17.0117C82.4062 17.2812 81.8027 17.416 81.123 17.416C80.5371 17.416 80.0215 17.2812 79.5762 17.0117C79.1309 16.7305 78.7852 16.3496 78.5391 15.8691C78.293 15.3887 78.1699 14.8555 78.1699 14.2695C78.1699 13.543 78.3691 12.9043 78.7676 12.3535C79.1777 11.791 79.7227 11.3281 80.4023 10.9648C81.9141 10.1914 83.8359 9.80469 86.168 9.80469C87.5391 9.80469 88.6992 9.93945 89.6484 10.209C90.5977 10.4668 91.3945 10.9355 92.0391 11.6152C92.5078 12.1074 92.8184 12.7344 92.9707 13.4961C93.1348 14.2461 93.2168 15.3008 93.2168 16.6602V26.293C93.2168 26.8672 93.2578 27.2715 93.3398 27.5059C93.4219 27.7285 93.5625 27.8398 93.7617 27.8398C93.9492 27.8398 94.1191 27.7988 94.2715 27.7168C94.4355 27.623 94.6406 27.4883 94.8867 27.3125L95.2383 27.9277C94.6758 28.3965 94.0195 28.7363 93.2695 28.9473C92.5195 29.1465 91.6172 29.2461 90.5625 29.2461C89.2969 29.2461 88.3652 28.9941 87.7676 28.4902C87.1816 27.9746 86.877 27.3184 86.8535 26.5215C86.3496 27.3535 85.6406 28.0156 84.7266 28.5078C83.8125 29 82.8047 29.2461 81.7031 29.2461C80.2852 29.2461 79.1719 28.8711 78.3633 28.1211C77.5664 27.3711 77.168 26.3691 77.168 25.1152C77.168 23.8848 77.5371 22.8594 78.2754 22.0391C79.0137 21.2188 80.168 20.5508 81.7383 20.0352C83.0156 19.5781 83.959 19.2207 84.5684 18.9629C85.1895 18.6934 85.7051 18.377 86.1152 18.0137C86.5371 17.6387 86.748 17.1992 86.748 16.6953V13.4785ZM86.748 18.1719C86.5723 18.4648 86.1035 18.9922 85.3418 19.7539C84.1699 20.8906 83.584 22.2441 83.584 23.8145C83.584 25.5137 84.1934 26.3633 85.4121 26.3633C85.916 26.3633 86.3613 26.1641 86.748 25.7656V18.1719ZM108.123 10.3496V11.0703H104.59V25.9766C104.59 26.4453 104.672 26.7793 104.836 26.9785C105 27.1777 105.281 27.2773 105.68 27.2773C105.973 27.2773 106.295 27.1953 106.646 27.0312C106.998 26.8555 107.32 26.5859 107.613 26.2227L108.158 26.6621C107.057 28.5605 105.352 29.5098 103.043 29.5098C101.391 29.5098 100.154 29.0996 99.334 28.2793C98.8418 27.7871 98.5137 27.166 98.3496 26.416C98.1855 25.666 98.1035 24.6172 98.1035 23.2695V11.0703H95.3789V10.3496H98.1035V6.06055C99.4043 6.06055 100.576 5.9375 101.619 5.69141C102.662 5.43359 103.652 5.0293 104.59 4.47852V10.3496H108.123ZM117.264 12.5117C118.354 10.707 120.264 9.80469 122.994 9.80469C124.904 9.80469 126.258 10.2852 127.055 11.2461C127.418 11.6797 127.682 12.2656 127.846 13.0039C128.021 13.7305 128.109 14.6973 128.109 15.9043V25.6602C128.109 26.3281 128.174 26.8496 128.303 27.2246C128.432 27.5996 128.637 27.8633 128.918 28.0156C129.211 28.168 129.609 28.2441 130.113 28.2441V29C127.535 28.9062 125.859 28.8594 125.086 28.8594C124.254 28.8594 122.549 28.9062 119.971 29V28.2441C120.393 28.2441 120.721 28.168 120.955 28.0156C121.189 27.8633 121.359 27.5996 121.465 27.2246C121.57 26.8496 121.623 26.3281 121.623 25.6602V13.9531C121.623 13.1797 121.482 12.6113 121.201 12.248C120.92 11.873 120.475 11.6855 119.865 11.6855C119.42 11.6855 118.998 11.7969 118.6 12.0195C118.201 12.2422 117.879 12.5527 117.633 12.9512C117.387 13.3379 117.264 13.7773 117.264 14.2695V25.6602C117.264 26.3281 117.316 26.8496 117.422 27.2246C117.527 27.5996 117.697 27.8633 117.932 28.0156C118.166 28.168 118.494 28.2441 118.916 28.2441V29C116.525 28.9062 114.943 28.8594 114.17 28.8594C113.338 28.8594 111.539 28.9062 108.773 29V28.2441C109.277 28.2441 109.676 28.168 109.969 28.0156C110.262 27.8633 110.473 27.5996 110.602 27.2246C110.73 26.8496 110.795 26.3281 110.795 25.6602V5.16406C110.795 4.05078 110.643 3.24805 110.338 2.75586C110.033 2.25195 109.512 2 108.773 2V1.24414C109.523 1.31445 110.268 1.34961 111.006 1.34961C113.525 1.34961 115.611 1.17969 117.264 0.839844V12.5117Z"
							fill="#2E445D"
						/>
					</svg>
					<p className="type type--pos-medium-bold">
						
						author: {manifest.author}
					</p>
					<p className="type type--pos-medium-normal">
						
						version {manifest.version}
					</p>
					<p className="flex type type--pos-medium-bold">
						<a
							className="type type--pos-medium-bold"
							href="https://github.com/codelastnight/to-path-figma"
							target="_blank">
							github
						</a>
						<span> |</span>

						<a
							className="type type--pos-medium-bold"
							href="https://twitter.com/artlastnight"
							target="_blank">
							twitter
						</a>
					</p>
					<div className="flex">
						
						<div className="col">
						<div className="label">Accuracy of Angles Calculations:</div>
								<InputIcon
									icon="icon icon--dist-horiz-spacing icon--black-3"
									values={setting}
									name="precision"
									blur={e => { }}
									setvalues={setSetting}
									></InputIcon>
						</div>
						
					</div>
				</div>
			</div>

			<div className="main">
				<SelectVisual value={selection} />
				<SelectOptions value={selection} form={setting} setForm={setSetting} />
			</div>

			<div className="footer">
				<div className="divider"></div>
				<div className="flex">
					<div className="help">
						<button
							className="button button--secondary link"
							onClick={() => showabout(!about)}>
							{about ? 'back ' : 'about'}
						</button>
					</div>
					<Create value={selection} isLink={link} onClick={onCreate} />
				</div>
			</div>
		</div>
	)
}

ReactDOM.render(<UI />, document.getElementById('react-page'))
