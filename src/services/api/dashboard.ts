
import { httpClient } from "./client";

export const dashboardAPI = {
    get: (groupType: string) => {
        return httpClient.get<any>(`/dashboard/groups/${groupType}`);
    },
};
