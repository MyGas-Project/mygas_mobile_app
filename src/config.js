// export const BASE_URL = 'http://139.180.156.26:3100/api/';
// export const AUTH_URL = 'http://139.180.156.26:3100/auth/';
// export const PATH_URL = 'http://139.180.156.26:3100/';

export const BASE_URL = 'http://192.168.110.78:5000/api/';
export const AUTH_URL = 'http://192.168.110.78:5000/auth/';
export const PATH_URL = 'http://192.168.110.78:5000/';

// export const BASE_URL = 'http://192.168.110.116:5000/api/';
// export const AUTH_URL = 'http://192.168.110.116:5000/auth/';
// export const PATH_URL = 'http://192.168.110.116:5000/';

export const processResponse = async (response) => {
  try {
    const statusCode = response.status;
    const data = response.json();
    const res = await Promise.all([statusCode, data]);
    return ({
      statusCode: res[0],
      data: res[1],
    });
  } catch (e) {
    console.log(e);
  }
}
