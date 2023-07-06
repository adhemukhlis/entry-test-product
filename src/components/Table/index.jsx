import { Table } from 'antd'
import { isEqual, omit } from 'lodash'
import { useRouter } from 'next/router'
import { memo } from 'react'
/**
 * MainTable
 * @param {string} rowKey
 * @param {object[]} dataSource
 * @param {object[]} columns
 * @param {{current, per_page, total }} query
 * @param {{current, per_page, total }} query
 * @param {{current, per_page, total }} query
 */
const MainTable = memo(
	({ rowKey = 'id', dataSource, columns, query, showPagination = true, ...other }) => {
		const router = useRouter()
		return (
			<Table
				rowKey={rowKey}
				dataSource={dataSource}
				columns={columns}
				scroll={{ x: 'max-content' }}
				pagination={
					showPagination
						? {
								current: query?.page ?? 1,
								total: query?.total ?? 0,
								pageSize: query?.per_page ?? 10,
								onChange: (page, pageSize) => {
									const other = omit(query, 'total')
									router.push({
										query: {
											...other,
											page: page,
											per_page: pageSize
										}
									})
								}
						  }
						: false
				}
				{...other}
			/>
		)
	},
	(prevProps, nextProps) =>
		!['dataSource', 'columns', 'query'].map((item) => isEqual(prevProps[item], nextProps[item])).includes(false)
)
export default MainTable
