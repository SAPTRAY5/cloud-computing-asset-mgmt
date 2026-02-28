exports.hello = async () => {
  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      // allow browser calls from your frontend
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify({
      message: "hello and ready for development...",
    }),
  };
};

exports.hello1 = async () => {
  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      // allow browser calls from your frontend
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify({
      message: "hello1 and ready for development...",
    }),
  };
};