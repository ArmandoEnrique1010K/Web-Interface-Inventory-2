import { z } from "zod";

export const responseSchema = z.object({
    type: z.enum(["success", "error"]),
    status: z.number(),
    message: z.string(),
    fields: z.optional(z.record(z.string(), z.string())),
    secretField: z.optional(z.string()),
});

export const createDataSchema = <T extends z.ZodType>(dataSchema: T) =>
    z.object({
        type: z.enum(["success", "error"]),
        status: z.number(),
        data: dataSchema,
    });

export const createDataListSchema = <T extends z.ZodType>(dataListSchema: T) =>
    z.object({
        type: z.enum(["success", "error"]),
        status: z.number(),
        data: z.array(dataListSchema),
    });

export const createPageDataListSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        type: z.enum(["success", "error"]),
        status: z.number(),
        data: z.object({
            content: z.array(itemSchema),
            page: z.number(),
            size: z.number(),
            totalElements: z.number(),
            totalPages: z.number(),
            first: z.boolean(),
            last: z.boolean(),
        }),
    });

// Se establece un esquema para las respuestas de las peticiones POST, PUT y PATCH
export const responseMessageSchema = responseSchema.pick({
    message: true,
});

export const errorResponseSchema = responseSchema.pick({
    fields: true,
    message: true,
});

// export type GeneralResponse = {
//     type: "success" | "error";
//     status: number;
//     message: string;
//     fields?: Record<string, string>;
// };

// export type DataPageResponse<T> = {
//     type: "success" | "error";
//     status: number;
//     data: {
//         content: T[];
//         page: number;
//         size: number;
//         totalElements: number;
//         totalPages: number;
//         first: boolean;
//         last: boolean;
//     };
// };

// export type DataListResponse<T> = {
//     type: "success" | "error";
//     status: number;
//     data: T[];
// };

// export type DataResponse<T> = {
//     type: "success" | "error";
//     status: number;
//     data: T;
// };

// export type PageData<T> = DataPageResponse<T>["data"];
// export type Data<T> = DataResponse<T>["data"];
// export type ListData<T> = DataListResponse<T>["data"];
// export type GeneralData = Pick<GeneralResponse, "fields" | "message">;

export type MenuItem = {
    label: string;
    icon: React.ReactNode;
    to?: string;
    isForm?: boolean;
};

export type GeneralError = {
    type: string;
    message: string;
    fields: Record<string, string>;
};
