import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, processResponse } from "../config";

export default async function GetStationsLists(token, filter = "", product_id = "") {
  try {
    const cachedData = await AsyncStorage.getItem("stations");
    let parsedCache = cachedData ? JSON.parse(cachedData) : [];

    const response = await fetch(`${BASE_URL}customer/station-list?filter=${filter}&inventory_id=${product_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await processResponse(response);
    const { statusCode, data } = res;
    
    // console.log(parsedCache.length, data.data.length);

    if (statusCode !== 200) {
      if (parsedCache.length > 0) {
        return { success: true, data: parsedCache, cached: true };
      }
      return {
        success: false,
        data: null,
        message: data?.message || "Failed to fetch stations",
      };
    }

    if (parsedCache.length === data.data.length) {
      return {
        success: true,
        data: parsedCache,
        statusCode,
        cached: true,
      };
    }

    await AsyncStorage.setItem("stations", JSON.stringify(data.data));

    return {
      success: true,
      data: data.data,
      statusCode,
      cached: false,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message || "An error occurred while fetching stations",
    };
  }
}
