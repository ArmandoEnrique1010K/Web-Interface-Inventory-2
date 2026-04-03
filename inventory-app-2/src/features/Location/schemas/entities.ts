import { z } from "zod";

export const regionSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const subregionSchema = z.object({
    id: z.number(),
    name: z.string(),
    regionId: z.number(),
    regionName: z.string(),
});

export const locationSchema = z.object({
    id: z.number(),
    name: z.string(),
    address: z.string(),
    status: z.boolean(),

    regionId: z.number().optional(),

    subregionId: z.number().optional(),
    subregionName: z.string(),
});
