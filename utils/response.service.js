const responseService = {
  statusCodes: {
    ok: 200,
    created: 201,
    accepted: 202,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500,
    serviceUnavailable: 503,
  },

  success(res, message, code, data, route) {
    const responseObj = { message };
    route === "auth" ? (responseObj.token = data) : (responseObj.data = data);
    res.status(code).json({
      ...responseObj,
    });
  },
};

module.exports = responseService;
