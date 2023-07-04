import validatePermission from './validate-permission'

const validateMenu = (_menu, authMenu) => {
	const validated = _menu.reduce((accumulator, currentValue) => {
		const res = []
		if ('children' in currentValue) {
			if ('permission_code' in currentValue) {
				if (validatePermission(authMenu, currentValue.permission_code, 'read')) {
					res.push(currentValue)
				}
			} else {
				res.push({
					...currentValue,
					children: currentValue.children.filter((item) =>
						'permission_code' in item ? validatePermission(authMenu, item.permission_code, 'read') : true
					)
				})
			}
		} else {
			if ('permission_code' in currentValue) {
				if (validatePermission(authMenu, currentValue.permission_code, 'read')) {
					res.push(currentValue)
				}
			} else {
				res.push(currentValue)
			}
		}
		return [...accumulator, ...res]
	}, [])
	return validated
}
export default validateMenu
