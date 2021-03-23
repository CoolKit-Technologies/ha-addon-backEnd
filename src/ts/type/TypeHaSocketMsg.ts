type TypeHaSocketCallServiceData = {
    domain: string;
    service: string;
    service_data: {
        entity_id: string;
        hs_color?: [number, number];
        color_temp?: number;
        brightness_pct?: number;
    };
};
type TypeHaSocketStateChangedData = {
    entity_id: string;
    new_state: {
        attributes: Object;
        context: { id: string; parent_id: string | null; user_id: string };
        entity_id: string;
        last_changed: string;
        last_updated: string;
        state: string;
    };
    old_state: {
        attributes: Object;
        context: { id: string; parent_id: string | null; user_id: string };
        entity_id: string;
        last_changed: string;
        last_updated: string;
        state: string;
    };
};

type TypeHaSocketMsg = {
    id: number;
    type: 'event' | 'result';
    event: {
        event_type: string;
        data: TypeHaSocketCallServiceData | TypeHaSocketStateChangedData;
        origin: string;
        time_fired: string;
        context: {
            id: string;
            parent_id: string | null;
            user_id: string;
        };
    };
    success: boolean;
    result: any | null;
};

export default TypeHaSocketMsg;
export { TypeHaSocketCallServiceData, TypeHaSocketStateChangedData };
