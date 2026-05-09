import "server-only";

import { db } from "@/lib/db";

/**
 * Borra a un usuario y todos los registros que lo apuntan sin cascade
 * declarado en el esquema Prisma. Operación destructiva — no se puede revertir.
 *
 * Para clientes: se borran sus proyectos (cascada a milestones, mensajes,
 * documentos, pagos, change requests del proyecto), sus cotizaciones, sus
 * contactos y los mensajes/documentos donde aparezcan como autor.
 *
 * Para PMs: sus proyectos quedan sin PM asignado (pmId = null) para no
 * destruir trabajo del cliente, pero el resto se elimina.
 */
export async function deleteUserDeep(userId: string) {
  return db.$transaction(async (tx) => {
    const target = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    });

    if (!target) {
      throw new Error("Usuario no encontrado.");
    }

    if (target.role === "PM") {
      // Reasigna proyectos a "sin PM" para preservar el trabajo del cliente.
      await tx.project.updateMany({ where: { pmId: target.id }, data: { pmId: null } });
    } else if (target.role === "CLIENT") {
      // Elimina sus proyectos (cascada a hitos, mensajes, documentos del
      // proyecto, pagos y change requests).
      const projects = await tx.project.findMany({
        where: { clientId: target.id },
        select: { id: true }
      });
      if (projects.length > 0) {
        await tx.project.deleteMany({ where: { id: { in: projects.map((p) => p.id) } } });
      }

      // Elimina sus cotizaciones (ya no las protege un proyecto).
      await tx.quote.deleteMany({ where: { clientId: target.id } });
    }

    // Limpia referencias de autoría que no son cascade.
    await tx.contactLead.deleteMany({ where: { userId: target.id } });
    await tx.message.deleteMany({ where: { senderId: target.id } });
    await tx.document.deleteMany({ where: { uploadedById: target.id } });
    await tx.payment.updateMany({ where: { createdById: target.id }, data: { createdById: null } });
    await tx.changeRequest.updateMany({
      where: { requestedById: target.id },
      data: { requestedById: null }
    });

    // Sessions y resetTokens cascadean al borrar User.
    await tx.user.delete({ where: { id: target.id } });
  });
}
