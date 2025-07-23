export const BASE_URL = 'http://139.180.156.26:1818/api/';
export const AUTH_URL = 'http://139.180.156.26:1818/auth/';
export const PATH_URL = 'http://139.180.156.26:1818/';

// export const processResponse = async (response) => {
//   try {
//     const statusCode = response.status;
//     // console.log("Raw Response Status:", statusCode);

//     // Check if response is ok before trying to parse JSON
//     if (!response.ok) {
//       // console.log("Response not ok, status:", statusCode);
//       // Try to get error text
//       let errorText = "Unknown error";
//       try {
//         const errorData = await response.text();
//         // console.log("Error response text:", errorData);
//         errorText = errorData;
//       } catch (e) {
//         console.log("Could not read error response text:", e);
//       }

//       return {
//         statusCode: statusCode,
//         data: { error: errorText },
//         success: false,
//       };
//     }

//     const data = await response.json();
//     // console.log("Response data:", data);

//     return {
//       statusCode: statusCode,
//       data: data,
//       success: true,
//     };
//   } catch (e) {
//     console.log("processResponse error:", e);
//     return {
//       statusCode: 0,
//       data: { error: "Failed to process response" },
//       success: false,
//     };
//   }
// };

export const processResponse = async (response) => {
  try {
    const statusCode = response.status;                 //
    const data = response.json();                       //
    const res = await Promise.all([statusCode, data]);  //
    return ({                                           // get response from api
      statusCode: res[0],                             //
      data: res[1],                                   //
    });
  } catch (e) {
    console.log(e);
  }
}
