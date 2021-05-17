export type TypeLtype = 'bright' | 'read' | 'computer' | 'nightLight' | 'white';

export type TypeLtypeParams = {
    [key in TypeLtype]: {
        br: number;
        ct: number;
    };
};