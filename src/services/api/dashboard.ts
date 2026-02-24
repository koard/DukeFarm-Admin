
import { httpClient } from "./client";

export const dashboardAPI = {
    get: (groupType: string, year?: string) => {
        const params = year ? `?year=${year}` : '';
        return httpClient.get<any>(`/dashboard/groups/${groupType}${params}`);
    },
};
