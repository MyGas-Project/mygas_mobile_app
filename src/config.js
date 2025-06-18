// export const BASE_URL = 'http://192.168.110.116:5000/api/';
// export const AUTH_URL = 'http://192.168.110.116:5000/auth/';
export const BASE_URL = "http://192.168.110.83:5000/api/";
export const AUTH_URL = "http://192.168.110.83:5000/auth/";

export const processResponse = async (response) => {
  try {
    const statusCode = response.status;
    console.log("Raw Response Status:", statusCode);

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      console.log("Response not ok, status:", statusCode);
      // Try to get error text
      let errorText = "Unknown error";
      try {
        const errorData = await response.text();
        console.log("Error response text:", errorData);
        errorText = errorData;
      } catch (e) {
        console.log("Could not read error response text:", e);
      }

      return {
        statusCode: statusCode,
        data: { error: errorText },
        success: false,
      };
    }

    const data = await response.json();
    console.log("Response data:", data);

    return {
      statusCode: statusCode,
      data: data,
      success: true,
    };
  } catch (e) {
    console.log("processResponse error:", e);
    return {
      statusCode: 0,
      data: { error: "Failed to process response" },
      success: false,
    };
  }
};
