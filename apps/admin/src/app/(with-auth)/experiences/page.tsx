import { getExperiences } from "@repo/actions";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import ExperiencesManager from "@/features/experiences/components/experiences-manager";

export const metadata = {
  title: "Dashboard: Experiences",
};

export default async function ExperiencesPage() {
  const { experiences } = await getExperiences();

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            description="Manage experiences (maximum 4)"
            title="Experiences"
          />
        </div>
        <Separator />
        <ExperiencesManager initialExperiences={experiences} />
      </div>
    </PageContainer>
  );
}
