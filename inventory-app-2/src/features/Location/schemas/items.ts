import { z } from "zod";
import { locationSchema, regionSchema, subregionSchema } from "./entities";

export const regionItemSchema = regionSchema;
export const subregionItemSchema = subregionSchema;
export const locationItemSchema = locationSchema;
export const searchLocationItemSchema = locationSchema.pick({
    id: true,
    name: true,
});

export type RegionItem = z.infer<typeof regionItemSchema>;
export type SubregionItem = z.infer<typeof subregionItemSchema>;
export type LocationItem = z.infer<typeof locationItemSchema>;
export type SearchLocationItem = z.infer<typeof searchLocationItemSchema>;
