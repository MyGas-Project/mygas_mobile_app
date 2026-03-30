import { BASE_URL } from "../config";

export const updatePassword = async ({ userInfo, passwordData }) => {
  const response = await fetch(`${BASE_URL}customer/update-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
    body: JSON.stringify({
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword,
      confirm_password: passwordData.confirmPassword,
      user_id: userInfo.user_id,
    }),
  });

  const data = await response.json();
  return { statusCode: response.status, data };
};

export const updateUserDetails = async ({ userInfo, details }) => {
  const response = await fetch(`${BASE_URL}customer/update-profile`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
    body: JSON.stringify({ ...details, user_id: userInfo.user_id }),
  });

  const data = await response.json();
  return { statusCode: response.status, data };
};
