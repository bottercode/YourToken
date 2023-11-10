function paginateResults(data, page, limit) {
  const offset = (page - 1) * limit

  return data.slice(offset, offset + limit)
}

export default paginateResults
