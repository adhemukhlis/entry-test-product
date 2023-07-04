let store = {}

const globalStore = {}

globalStore.set = (key, value) => {
	store = { ...store, [key]: value }
}

globalStore.get = (key) => {
	return store[key]
}

export default globalStore
