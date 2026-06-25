import type { Setup } from "../types/seutp";
import CopmareTable from "./CompareTable";
//import compareSetups from "../utils/compareSetups";
import SetupSummary from "./SetupSummary";

type CompareViewProps = {
  setupA: Setup;
  setupB: Setup;
  showAll: boolean;
};

export default function CompareView({ setupA, setupB, showAll }: CompareViewProps) {
  let content;

  if (!setupA || !setupB) {
    content = <h1>Loading</h1>;
  } else {
    content = (
      <div className="w-full max-w-10/12 mx-auto flex flex-col gap-10">
        <div className="surface border border-theme rounded-lg p-5 flex flex-col gap-4 shadow-sm">
          {/* CAR NAME */}
          <div className="text-center">
            <h2 className="text-heading text-xl font-semibold">
              {setupA.carName}
            </h2>
          </div>

          {/* SETUP COMPARISON ROW */}
          <div className="grid grid-cols-3 items-center">
            <div className="justify-self-start">
              <SetupSummary
                setupName={setupA.setupName}
                trackName={setupA.trackName}
              />
            </div>

            <div className="flex justify-center items-center whitespace-nowrap gap-20">
              <div className="text-heading font-semibold">A</div>
              <div className="text-muted font-medium px-4">→</div>
              <div className="text-heading font-semibold">B</div>
            </div>

            <div className="justify-self-end">
              <SetupSummary
                setupName={setupB.setupName}
                trackName={setupB.trackName}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          {setupA.categories.map((aCat, index) => {
            const bCat = setupB.categories[index];

            return <CopmareTable key={index} aCat={aCat} bCat={bCat} showAll={showAll} />;
          })}
        </div>
      </div>
    );
  }
  return <>{content}</>;
}
