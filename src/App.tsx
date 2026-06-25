import { useState } from "react";
import CompareView from "./components/CompareView";
import parseHtm from "./utils/parseHtm";
import type { Setup } from "./types/seutp";
import FileDropzone from "./components/FileDropzone";

type SetupSlot = {
  file: File;
  setup: Setup;
};

function App() {
  const [setupA, setSetupA] = useState<SetupSlot | null>(null);
  const [setupB, setSetupB] = useState<SetupSlot | null>(null);

  const [view, setView] = useState<"upload" | "compare">("upload");

  const [showAll, setShowAll] = useState<boolean>(true);

  function validateSetups(a: Setup | null, b: Setup | null) {
    if (!a || !b) return null;

    if (a.carName !== b.carName) {
      return "Error: Setups must be for the same car";
    }

    return null;
  }
  const handleSetupASelected = async (file: File | null) => {
    if (!file) return;

    const setup = await parseHtm(file);
    setSetupA({ file, setup });
  };

  const handleSetupBSelected = async (file: File | null) => {
    if (!file) return;

    const setup = await parseHtm(file);
    setSetupB({ file, setup });
  };

  const handleCompareClick = async () => {
    if (!setupA || !setupB) return;

    setView("compare");
  };

  function handleResetClick() {
    setView("upload");

    setSetupA(null);
    setSetupB(null);
  }

  function handleShowClick() {
    setShowAll(!showAll);
  }

  function handleSwapClick() {
    const tempSlot = setupA;

    setSetupA(setupB);
    setSetupB(tempSlot);
  }

  const error = validateSetups(setupA?.setup ?? null, setupB?.setup ?? null);

  return (
    <div className="min-h-screen bg-bg text-primary flex flex-col">
      <div className="max-w-6xl mx-auto w-full px-6 py-10 flex flex-col gap-10">
        <h1 className="text-heading text-center text-4xl font-semibold">
          iRacing Setup Comparison
        </h1>
        <div className="flex flex-col gap-10 items-center">
          {view === "upload" ? (
            <>
              <div className="surface border border-theme rounded-lg p-6 flex gap-8 justify-center">
                <FileDropzone
                  label="Setup A"
                  file={setupA?.file ?? null}
                  onFileSelected={handleSetupASelected}
                  onRemove={() => setSetupA(null)}
                />
                <FileDropzone
                  label="Setup B"
                  file={setupB?.file ?? null}
                  onFileSelected={handleSetupBSelected}
                  onRemove={() => setSetupB(null)}
                />
              </div>
              <div className="h-6 flex items-center justify-center">
                {error && (
                  <span className="text-red-400 text-sm font-medium">
                    {error}
                  </span>
                )}
              </div>
              <button
                onClick={handleCompareClick}
                disabled={error !== null || !setupA || !setupB}
                className="
                  px-6 py-3
                  rounded-lg
                  bg-accent
                  text-white
                  font-semibold
                  text-sm
                  shadow-sm
                  transition-all duration-150

                  bg-blue-600

                  hover:opacity-90
                  active:scale-[0.98]
                  active:shadow-none

                  disabled:bg-slate-600
                  disabled:text-gray-500
                  disabled:cursor-not-allowed
                  disabled:scale-100
                "
              >
                Compare
              </button>
            </>
          ) : (
            <>
              <div className="flex gap-10 items-center">
                <button
                  onClick={handleResetClick}
                  className="
                px-4 py-2 rounded-md
                bg-orange-600 text-white font-medium
                hover:bg-orange-700 active:bg-orange-800
                transition
              "
                >
                  Reset
                </button>
                <button
                  onClick={handleShowClick}
                  className="
                px-4 py-2 rounded-md
                bg-green-600 text-white font-medium
                hover:bg-green-700 active:bg-green-800
                transition
              "
                >
                  Show All
                </button>
                <button
                  onClick={handleSwapClick}
                  className="
                px-4 py-2 rounded-md
                bg-blue-600 text-white font-medium
                hover:bg-blue-700 active:bg-blue-800
                transition
              "
                >
                  Swap
                </button>
              </div>
              <CompareView setupA={setupA!.setup} setupB={setupB!.setup} showAll={showAll} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
