import { z } from "zod";

import { companySchema, stockLotSchema } from "./entities";

// POR CADA REQUEST SE DEFINE UN SCHEMA Y SE EXTRAE LAS PROPIEDADES NECESARIAS
export const companyForm = companySchema.pick({
    name: true,
});

export const stockLotReceiveForm = stockLotSchema.pick({
    quantity: true,
    comment: true,
    modelId: true,
    companyId: true,
});

export const stockLotTransferForm = stockLotSchema.pick({
    quantity: true,
    comment: true,
    stockLotReceiverId: true,
});

export const stockLotAdjustmentForm = stockLotSchema.pick({
    quantity: true,
    comment: true,
});

export type CompanyForm = z.infer<typeof companyForm>;
export type StockLotReceiveForm = z.infer<typeof stockLotReceiveForm>;
export type StockLotTransferForm = z.infer<typeof stockLotTransferForm>;
export type StockLotAdjustmentForm = z.infer<typeof stockLotAdjustmentForm>;
