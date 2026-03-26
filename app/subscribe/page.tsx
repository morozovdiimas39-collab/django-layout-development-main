import type { Metadata } from "next";
import SubscribePage from "@/pages/SubscribePage";

export const metadata: Metadata = {
  title: "Подписаться — Telegram или MAX",
  description:
    "Подпишитесь на Telegram или MAX, чтобы получать анонсы, полезные материалы и новости школы.",
  alternates: { canonical: "https://kazbek-meretukov.ru/subscribe" },
  openGraph: {
    url: "https://kazbek-meretukov.ru/subscribe",
    title: "Подписаться — Telegram или MAX",
    description:
      "Подпишитесь на Telegram или MAX, чтобы получать анонсы, полезные материалы и новости школы.",
    type: "website",
  },
};

export default function Page() {
  return <SubscribePage />;
}

