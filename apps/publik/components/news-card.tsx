import { CalendarDays, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { News } from "@desa/lib";
import { formatTanggal } from "@desa/lib";
import { Badge, Card } from "@/components/ui/card";

export function NewsCard({ news }: { news: News }) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/berita/${news.slug}`}>
        <div className="relative aspect-video bg-gray-100">
          {news.thumbnail ? (
            <Image
              src={news.thumbnail}
              alt={news.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center bg-gradient-to-br from-primary/10 to-secondary/10 text-primary/40">
              <span className="text-4xl font-bold">D</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <Badge>{news.category}</Badge>
          <h3 className="mt-2 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-primary">
            {news.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">{news.excerpt}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> {news.author}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatTanggal(news.publishedAt || news.createdAt)}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
