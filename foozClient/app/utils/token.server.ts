export const GetTokenFromRequest = (request: Request) => {
  const cookie = request.headers.get("Cookie");
  const session = cookie?.split(";").find((s) => s.includes("_session="));
  if (!session) {
    return null;
  }
  const b64start = session.indexOf("=") ?? 0;
  const b64end = session.includes("%3D")
    ? session.indexOf("%3D")
    : session.includes(".")
    ? session.indexOf(".")
    : session.length;

  const base64Data = session.substring(b64start + 1, b64end) ?? "";
  const json = atob(base64Data);
  const data = JSON.parse(json);
  return data.user.accessToken;
};
