import rateLimit from "express-rate-limit";

export const limiter = rateLimit(
    {
        windowMs: 1000*60,
        max: 150, //Límite de peticiones
        message: {
            message: 'Estás bloqueado, espera 15 minutos antes de volver a intentarlo.'
        }
    }
)