'use client'

import { createContext, useContext, useState } from 'react'

const NavbarContext = createContext({})
const initialData = {
	id: undefined,
	email: '',
	username: '',
	full_name: '',
	photo: '',
	role: '',
	handphone: '',
	address: '',
	isLoggedIn: false
}
export const NavbarContextProvider = ({ children, defaultValues = {} }) => {
	const [userData, setUserData] = useState({ ...initialData, ...defaultValues })
	const resetUserData = () => {
		setUserData(initialData)
	}
	return <NavbarContext.Provider value={{ userData, setUserData, resetUserData }}>{children}</NavbarContext.Provider>
}

export const useNavbarContext = () => useContext(NavbarContext)
