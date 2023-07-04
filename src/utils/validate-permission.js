const validatePermission = (menu, code, permission) => {
	const matchCode = menu.find((data) => data.code === code)
	const result = matchCode === undefined ? false : (matchCode?.allowed || []).includes(permission)
	return result
}

export default validatePermission
