//prefer to use await rather than then digging
async function apiGet({
  url,
  authorization,
}: {
  url: string;
  authorization: string;
}) {
  try {
    const response = await fetch(url, {
      method: "get",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${authorization}`,
      },
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (e) {
    console.log(JSON.stringify(e));
  }
}

export { apiGet };
