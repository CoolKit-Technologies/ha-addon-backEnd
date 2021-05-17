export type TypeHaToken = {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
};
export type TypeToken = TypeHaToken & {
    expires_time: number;
    cliend_id: string;
};
