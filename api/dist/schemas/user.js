"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResponseSchema = exports.userIdParamSchema = exports.userUpdateSchema = exports.userCreateSchema = void 0;
const zod_1 = require("zod");
exports.userCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nome é obrigatório.'),
    email: zod_1.z.string().email('Email inválido.'),
    password: zod_1.z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
});
exports.userUpdateSchema = exports.userCreateSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
});
exports.userIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID inválido.'),
});
exports.userResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
//# sourceMappingURL=user.js.map