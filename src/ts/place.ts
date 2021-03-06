/* 
	code for all the placing in the figma page
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/

import { multiply, move, rotate,pointBtwnByLength  } from './helper'


/**
 * place the objects on a point, based on user settings.
 * @param object 
 * @param point 
 * @param options 
 * @param curve 
 */
const place = (
	object: SceneNode,
	point: Point,
	options: SettingData,
	curve: VectorNode
) => {
	//set names
	object.name = object.name.replace("[Linked] ", '[Copy] ')
	// find center of object
	const center = {
		x: 0 -  object.width * options.horizontalAlign, // no horozonatal align on text, kerning gets fucked up
		y: 0 - object.height * options.verticalAlign
	}
	//angle of object converted to degrees
	let angle = ((point.angle - 180) * Math.PI) / 180

	// zero it
	//spaceing them
	object.relativeTransform = move(center.x, center.y)

	// more code taken from jyc, the god himself https://github.com/jyc http://jyc.eqv.io
	// Rotate the object.
	object.rotation = 0
	if (options.rotCheck) {
		object.relativeTransform = multiply(rotate(angle), object.relativeTransform)
	}
	//move the object

	object.relativeTransform = multiply(
		move(
			point.x + curve.relativeTransform[0][2],
			point.y + curve.relativeTransform[1][2]
		),
		object.relativeTransform
	)
}

/**
 * estimates and returns the point closest to where the object should be, based on horizontal length
 * @param pointArr 
 * @param pass 
 */
const object2Point = (pointArr: Array<Point>, pass: Pass): Point => {
	//
	let rotation

	let estPoint: Point
	for (pass.pointIndex; pass.pointIndex < pointArr.length; pass.pointIndex++) {
		// find nearest point to the length of the word
		if (pass.spacing <= pointArr[pass.pointIndex + 1].totalDist) {
			let nextpoint = pointArr[pass.pointIndex + 1]

			const localDist = pass.spacing - pointArr[pass.pointIndex].totalDist
			rotation = pointArr[pass.pointIndex].angle

			estPoint = pointBtwnByLength(
				pointArr[pass.pointIndex],
				nextpoint,
				localDist,
				nextpoint.dist,
				rotation
			)

			if (estPoint.x === Infinity) {
			} else {
				break
			}
		} 
	}
	
	return estPoint
}

/**
 * convert text into indivisual characters, then put those on a curve
 * @param node 
 * @param pointArr 
 * @param data 
 * @param group 
 */
export const text2Curve = (
	node: TextNode,
	pointArr: Array<Point>,
	data: LinkedData,
	group: GroupNode

) => {
	const newNodes: SceneNode[] = []
	var options: SettingData = data.setting
	//convert text into each letter indivusally
	node.textAutoResize = 'WIDTH_AND_HEIGHT'

	const charArr = [...node.characters]
	// values needed to pass between each objects
	let pass: Pass = {
		spacing: 0 + options.offset,
		pointIndex: 0
	}

	// disable spacing option in text mode
	options.spacing = 0
	let prevletter = 0;
	for (let i = 0; i < charArr.length; i++) {
		let letter = node.clone()
		//copy settings

		letter.fontName = node.getRangeFontName(i, i + 1)
		letter.fontSize = node.getRangeFontSize(i, i + 1)
		letter.characters = safeSpace(charArr[i]) + ' '

		letter.letterSpacing = node.getRangeLetterSpacing(i, i + 1)

		// center the letters
		//letter.textAlignHorizontal = 'CENTER'
		letter.textAlignVertical = 'CENTER'
		letter.textAutoResize = 'WIDTH_AND_HEIGHT'

		// put the object in the right place

		pass.spacing = pass.spacing + letter.width*options.horizontalAlign + (prevletter*(1-options.horizontalAlign)) + options.spacing
		prevletter = letter.width
		let point = object2Point(pointArr, pass)


		// place the thing
		place(letter, point, options, data.curve)
		//append that shit
		letter.characters = safeSpace(charArr[i])
		newNodes.push(letter)
		group.appendChild(letter)
		// kill loop early if the objects are longer then the curve
		// replace later with a better thing
		if (pass.spacing >= pointArr[pointArr.length - 1].totalDist) {
			break
		}
	}
	// group things and scroll into view
	

	return
}

/**
 * clones the objects x amount of times to curve
 * @param node 
 * @param pointArr 
 * @param data 
 * @param group 
 */
export const object2Curve = (
	node: SceneNode,
	pointArr: Array<Point>,
	data: LinkedData,
	group: GroupNode
) => {
	const newNodes: SceneNode[] = []
	var options: SettingData = data.setting
	// values needed to pass between each objects
	let pass: Pass = {
		spacing: 0 + options.offset,
		pointIndex: 0
	}
	
	for (let i = 0; i < options.count; i++) {
		//copy object
		let object
		if (node.type === 'COMPONENT') object = node.createInstance()
		else object = node.clone()

		// find the position where object should go
		let point = object2Point(pointArr, pass)

		pass.spacing = pass.spacing + object.width + options.spacing
		// place the thing
		place(object, point, options, data.curve)
		//append that shit
		newNodes.push(object)
		group.appendChild(object)
		// kill loop early if the objects are longer then the curve
		// replace later with a better thing

		if (pass.spacing >= pointArr[pointArr.length - 1].totalDist) {
			break
		}
	}

	// if autowidth put object at very last point
	if (!options.isLoop && options.autoWidth) {
		let object
		if (node.type === 'COMPONENT') object = node.createInstance()
		else object = node.clone()

		const point = pointArr[pointArr.length - 1]
		place(object, point, options, data.curve)
		newNodes.push(object)
		group.appendChild(object)
	}
	// group things and scroll into view
	return
}

/**
 * remove all nodes in a group besides the curve node
 * @param group group object to look through
 * @param curveID the object id to NOT delete
 */
export const deleteNodeinGroup = (group:GroupNode, curveID: string) => {
	group.children.forEach(i => {if(i.id !== curveID) i.remove()})
}

// this didn't need to be a function but like i already wrote so
/**
 * case for handling spaces, becasue figma will auto them as 0 width; character 8197 isnt the best but you kno what... its good enough
 * @param c input string
 */
const safeSpace = (c: string): string => {
	return c.replace(' ', String.fromCharCode(8197))
}