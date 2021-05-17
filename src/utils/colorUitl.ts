import colorConvert from 'color-convert';

const parseRGB2HS = (red: number, green: number, blue: number): [number, number] => {
    const [hue, saturation] = colorConvert.rgb.hsl(red, green, blue);
    return [hue, saturation];
};

const parseHS2RGB = (hs: [number, number]): [number, number, number] => {
    return colorConvert.hsl.rgb([...hs, 50]);
};

export { parseHS2RGB, parseRGB2HS };
