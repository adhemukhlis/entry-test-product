/**
 * IDR Formatter
 * @param {number|string} currency - the number you want to format into currency.
 * @param {number} minimumFractionDigits - the minimum digits of fraction into currency.
 * @param {number} maximumFractionDigits - the maximum digits of fraction into currency.
 */

const regWhitespace = new RegExp('\\s')

const idrFormatter = (currency, minimumFractionDigits = 0, maximumFractionDigits = 0, noSpace = false) =>
	new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits,
		maximumFractionDigits
	})
		.format(currency)
		.replace(!!noSpace ? regWhitespace : '', '')
export default idrFormatter
