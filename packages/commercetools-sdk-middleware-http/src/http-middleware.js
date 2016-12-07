export default function httpMiddleware (next) {
  return (req, res) => {
    // FIXME: proper implementation
    setTimeout(() => {
      const parsedResponse = {
        ...res,
        body: {
          foo: 'bar',
        },
        statusCode: 200,
      }
      next(req, parsedResponse)
    }, 500)
  }
}
