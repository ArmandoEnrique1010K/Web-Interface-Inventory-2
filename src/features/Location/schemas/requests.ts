import type z from "zod";
import { locationSchema, regionSchema, subregionSchema } from "./entities";

export const regionForm = regionSchema.pick({
    name: true,
});

export const subregionForm = subregionSchema.pick({
    name: true,
    regionId: true,
});

export const locationForm = locationSchema.pick({
    name: true,
    address: true,
    subregionId: true,
});

export type RegionForm = z.infer<typeof regionForm>;
export type SubregionForm = z.infer<typeof subregionForm>;
export type LocationForm = z.infer<typeof locationForm>;
