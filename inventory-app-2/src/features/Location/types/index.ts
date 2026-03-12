import { z } from "zod"

export const regionSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const subregionSchema = z.object({
    id: z.number(),
    name: z.string(),
    regionId: z.string(),
    regionName: z.string(),
})

export const locationSchema = z.object({
    id: z.number(),
    name: z.string(),
    address: z.string(),
    status: z.boolean(),
    subregionId: z.string(),
    subregionName: z.string()
})

type Region = z.infer<typeof regionSchema>
type Subregion = z.infer<typeof subregionSchema>
type Location = z.infer<typeof locationSchema>

export type RegionForm = Pick<Region, "name">
export type SubregionForm = Pick<Subregion, "name" | "regionId">
export type LocationForm = Pick<Location, "name" | "address" | "subregionId">

export type RegionItem = Region
export type SubregionItem = Subregion
export type LocationItem = Location;
