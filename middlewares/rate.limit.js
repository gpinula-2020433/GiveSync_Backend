import rateLimit from "express-rate-limit";

export const limiter = rateLimit(
    {
        windowMs: 15 * 60 * 1000, //15 minutos
        max: 1000, //Límite de 100 peticiones
        message: {
            message: 'Estás bloqueado, espera 15 minutos antes de volver a intentarlo.'
        }
    }
)