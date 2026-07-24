import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, processResponse } from "../config";

export default async function GetStationsLists(token, filter = "", product_id = "", is_list = false) {
  try {
    const cacheKey = is_list ? "stations_list" : "stations";
    const cachedData = await AsyncStorage.getItem(cacheKey);
    let parsedCache = cachedData ? JSON.parse(cachedData) : [];

    const response = await fetch(`${BASE_URL}customer/station-list?filter=${filter}&inventory_id=${product_id}&is_list=${is_list}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await processResponse(response);
    const { statusCode, data } = res;

    // console.log("ALL STATIONS:", JSON.stringify(data?.data, null, 2));

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

    await AsyncStorage.setItem(cacheKey, JSON.stringify(data.data));

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