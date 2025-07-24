import { Prisma } from "generated/prisma";
import { wrapper } from "@/helpers/utils/wrapper.js";
export const basicAuth = (req, res, next) => {
  const status = Prisma.user.findFirst({
    where:{
      email : req.email,
    },
    select : { 
      role : true
    } 
  })

  if (status.role !== 'ADMIN'){
    return wrapper.response(res, 'fail', { err: new Error('Unauthorized access') }, 'You do not have permission to perform this action', 403);
  }

  next();
}