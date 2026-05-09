import { describe, it, expect } from "vitest";

import {
  buildClientWelcomeEmail,
  buildPmAccountCreatedEmail,
  buildDashboardMessageEmail,
  buildChangeRequestEmail,
  buildProjectAssignmentEmail,
  buildDeliverableNotificationEmail,
  buildQuoteStatusEmail,
  buildMeetingScheduledEmail
} from "@/server/email/templates/dashboard-events";
import {
  buildCompanyLeadEmail,
  buildLeadConfirmationEmail
} from "@/server/email/templates/public-leads";

describe("buildClientWelcomeEmail", () => {
  const base = {
    clientName: "Miyuki Shirogane",
    dashboardUrl: "https://codenium.test/dashboard/client",
    quoteUrl: "https://codenium.test/quote"
  };

  it("uses the welcome subject for new clients", () => {
    const out = buildClientWelcomeEmail(base);
    expect(out.subject.toLowerCase()).toContain("bienvenido a codenium");
    expect(out.subject.toLowerCase()).toContain("proyecto");
  });

  it("greets the client by name in text and html", () => {
    const out = buildClientWelcomeEmail(base);
    expect(out.text).toContain("Hola Miyuki Shirogane,");
    expect(out.html).toContain("Miyuki Shirogane");
  });

  it("links to the cotizador and the dashboard", () => {
    const out = buildClientWelcomeEmail(base);
    expect(out.html).toContain(base.quoteUrl);
    expect(out.html).toContain(base.dashboardUrl);
    expect(out.text).toContain(base.quoteUrl);
    expect(out.text).toContain(base.dashboardUrl);
  });

  it("escapes HTML in the client name", () => {
    const out = buildClientWelcomeEmail({ ...base, clientName: "<script>x</script>" });
    expect(out.html).not.toContain("<script>x</script>");
    expect(out.html).toContain("&lt;script&gt;");
  });
});

describe("buildPmAccountCreatedEmail", () => {
  const base = {
    pmName: "Carolina Rivera",
    pmEmail: "carolina@codenium.com",
    tempPassword: "CodeniumABCD1234",
    loginUrl: "https://codenium.test/login"
  };

  it("uses the team welcome subject", () => {
    const out = buildPmAccountCreatedEmail(base);
    expect(out.subject.toLowerCase()).toContain("bienvenido al equipo");
  });

  it("includes credentials and login url", () => {
    const out = buildPmAccountCreatedEmail(base);
    expect(out.text).toContain(base.pmEmail);
    expect(out.text).toContain(base.tempPassword);
    expect(out.text).toContain(base.loginUrl);
    expect(out.html).toContain(base.pmEmail);
    expect(out.html).toContain(base.tempPassword);
    expect(out.html).toContain(base.loginUrl);
  });
});

describe("buildDashboardMessageEmail", () => {
  it("renders sender, project and message", () => {
    const out = buildDashboardMessageEmail({
      recipientName: "Carolina",
      projectName: "Portal X",
      senderName: "Daniel",
      senderRole: "client",
      message: "¿Cómo va el avance?"
    });
    expect(out.subject).toContain("Portal X");
    expect(out.text).toContain("Daniel");
    expect(out.text).toContain("¿Cómo va el avance?");
    expect(out.html).toContain("Portal X");
  });

  it("escapes HTML in the message body", () => {
    const out = buildDashboardMessageEmail({
      recipientName: "Carolina",
      projectName: "Portal X",
      senderName: "Daniel",
      senderRole: "client",
      message: "<img src=x onerror=alert(1)>"
    });
    expect(out.html).not.toContain("<img src=x");
    expect(out.html).toContain("&lt;img");
  });
});

describe("buildChangeRequestEmail", () => {
  it("translates priority codes to labels", () => {
    const high = buildChangeRequestEmail({
      recipientName: "Carolina",
      requestedBy: "Daniel",
      projectName: "Portal X",
      title: "Reordenar hero",
      detail: "Mover bloque",
      priority: "high"
    });
    expect(high.text).toContain("Prioridad: Alta");

    const medium = buildChangeRequestEmail({
      recipientName: "Carolina",
      requestedBy: "Daniel",
      projectName: "Portal X",
      title: "x",
      detail: "y",
      priority: "medium"
    });
    expect(medium.text).toContain("Prioridad: Media");

    const low = buildChangeRequestEmail({
      recipientName: "Carolina",
      requestedBy: "Daniel",
      projectName: "Portal X",
      title: "x",
      detail: "y",
      priority: "low"
    });
    expect(low.text).toContain("Prioridad: Baja");
  });
});

describe("buildProjectAssignmentEmail", () => {
  it("includes quote code, project name and counterpart", () => {
    const out = buildProjectAssignmentEmail({
      recipientName: "Daniel",
      quoteCode: "Q-AB12",
      quoteTitle: "Plan PYMES",
      projectName: "Portal X",
      counterpartLabel: "PM asignado",
      counterpartName: "Carolina"
    });
    expect(out.subject).toContain("Portal X");
    expect(out.text).toContain("Q-AB12");
    expect(out.text).toContain("PM asignado: Carolina");
    expect(out.html).toContain("Q-AB12");
  });
});

describe("buildDeliverableNotificationEmail", () => {
  it("omits the file line when fileName is missing", () => {
    const withFile = buildDeliverableNotificationEmail({
      recipientName: "Daniel",
      projectName: "Portal X",
      title: "Wireframes",
      kind: "Diseño",
      fileName: "wf.pdf",
      registeredBy: "Carolina"
    });
    const withoutFile = buildDeliverableNotificationEmail({
      recipientName: "Daniel",
      projectName: "Portal X",
      title: "Wireframes",
      kind: "Diseño",
      registeredBy: "Carolina"
    });
    expect(withFile.text).toContain("Archivo: wf.pdf");
    expect(withoutFile.text).not.toContain("Archivo:");
  });
});

describe("buildQuoteStatusEmail", () => {
  it("uses a different subject when status is rejected", () => {
    const accepted = buildQuoteStatusEmail({
      recipientName: "Daniel",
      quoteCode: "Q-1",
      quoteTitle: "Plan",
      status: "accepted"
    });
    const rejected = buildQuoteStatusEmail({
      recipientName: "Daniel",
      quoteCode: "Q-1",
      quoteTitle: "Plan",
      status: "rejected"
    });
    const reviewed = buildQuoteStatusEmail({
      recipientName: "Daniel",
      quoteCode: "Q-1",
      quoteTitle: "Plan",
      status: "reviewed"
    });
    expect(rejected.subject.toLowerCase()).toContain("no pudo avanzar");
    expect(reviewed.subject.toLowerCase()).toContain("revisando");
    expect(accepted.subject.toLowerCase()).toContain("actualización");
  });
});

describe("buildMeetingScheduledEmail", () => {
  it("includes date, time and host", () => {
    const out = buildMeetingScheduledEmail({
      recipientName: "Daniel",
      projectName: "Portal X",
      date: "2026-05-16",
      time: "10:00",
      duration: "30 min",
      hostName: "Carolina"
    });
    expect(out.text).toContain("2026-05-16");
    expect(out.text).toContain("10:00");
    expect(out.text).toContain("Carolina");
  });

  it("only renders meetingLink when provided", () => {
    const withLink = buildMeetingScheduledEmail({
      recipientName: "Daniel",
      projectName: "Portal X",
      date: "2026-05-16",
      time: "10:00",
      duration: "30 min",
      hostName: "Carolina",
      meetingLink: "https://meet.test/xyz"
    });
    const withoutLink = buildMeetingScheduledEmail({
      recipientName: "Daniel",
      projectName: "Portal X",
      date: "2026-05-16",
      time: "10:00",
      duration: "30 min",
      hostName: "Carolina"
    });
    expect(withLink.html).toContain("https://meet.test/xyz");
    expect(withoutLink.html).not.toContain("Unirse a la reunión");
  });
});

describe("buildCompanyLeadEmail (notificación interna)", () => {
  it("uses different subjects for quote vs contact", () => {
    const quote = buildCompanyLeadEmail({
      lead: {
        source: "quote",
        firstName: "Daniel",
        lastName: "Ortega",
        email: "d@x.com",
        phone: "+52",
        message: "Hola",
        originPath: "/quote"
      },
      receivedAt: "08/05/2026"
    });
    const contact = buildCompanyLeadEmail({
      lead: {
        source: "contact",
        firstName: "Daniel",
        lastName: "Ortega",
        email: "d@x.com",
        phone: "+52",
        message: "Hola",
        originPath: "/contact"
      },
      receivedAt: "08/05/2026"
    });
    expect(quote.subject.toLowerCase()).toContain("cotización");
    expect(contact.subject.toLowerCase()).toContain("contacto");
  });
});

describe("buildLeadConfirmationEmail (confirmación al cliente)", () => {
  it("greets by first name only", () => {
    const out = buildLeadConfirmationEmail({
      lead: {
        source: "quote",
        firstName: "Daniel",
        lastName: "Ortega",
        email: "d@x.com",
        phone: "+52",
        message: "Hola",
        originPath: "/quote"
      },
      receivedAt: "08/05/2026"
    });
    expect(out.text).toContain("Hola Daniel,");
    expect(out.text).not.toContain("Ortega");
  });
});
