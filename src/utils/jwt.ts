import {PATH_AUTH} from "@/routes/paths";
import API from "@/apis/connection/api-backend";
import {jwtDecode} from "jwt-decode";

// ----------------------------------------------------------------------

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const handleTokenExpired = (exp: number) => {
  // const expiredTimer;

  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    localStorage.removeItem('accessToken');

    window.location.href = PATH_AUTH.login;
  }, timeLeft);
};

const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // This function below will handle when token is expired
    const {exp} = jwtDecode<{ exp: number }>(accessToken); // ~3 days by minimals server
    handleTokenExpired(exp);
  } else {
    console.log("tao xóa nhá")
    localStorage.removeItem('accessToken');
    delete API.defaults.headers.common.Authorization;
  }
};

export {isValidToken, setSession};
