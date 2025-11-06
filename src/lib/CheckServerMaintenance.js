import { AUTH_URL, BASE_URL, processResponse } from '../config';

export async function CheckServerMaintenance() {
    try {
        const resp = await fetch(`${AUTH_URL}settings`, { method: "GET" });
        const data = await resp.json();
        return data;
    } catch (error) {
        return error;
    }
}
