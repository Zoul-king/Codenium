import "./globals.css";

export const metadata = {
  title: "AxolotlCode",
  description: "Réplica reusable del sistema visual de AxolotlCode, construida con Next y Tailwind CSS."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
