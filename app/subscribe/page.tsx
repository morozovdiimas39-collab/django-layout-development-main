import type { Metadata } from "next";
import SubscribePage from "@/pages/SubscribePage";

export const metadata: Metadata = {
  title: "Подписаться — Telegram",
  description:
    "Материалы, новости и анонсы актёрской школы в Telegram: пробные, наборы, даты.",
  alternates: { canonical: "https://kazbek-meretukov.ru/subscribe" },
  openGraph: {
    url: "https://kazbek-meretukov.ru/subscribe",
    title: "Подписаться — Telegram",
    description:
      "Материалы, новости и анонсы актёрской школы в Telegram: пробные, наборы, даты.",
    type: "website",
  },
};

export default function Page() {
  return <SubscribePage />;
}

