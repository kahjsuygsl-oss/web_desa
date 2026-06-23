import { statisticsRepo } from "@desa/lib";
import { PageTitle } from "@/components/page-title";
import { StatisticsForm } from "@/components/statistics-form";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function StatistikPage() {
  const stats = await statisticsRepo.getStatistics().catch(() => []);

  return (
    <div>
      <PageTitle title="Statistik Desa" description="Perbarui data kependudukan & wilayah." />
      <Card>
        <CardContent>
          <StatisticsForm stats={stats} />
        </CardContent>
      </Card>
    </div>
  );
}
