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

  function handleSwapClick() {
    const tempSlot = setupA;

    setSetupA(setupB);
    setSetupB(tempSlot);
  }

  const error = validateSetups(setupA?.setup ?? null, setupB?.setup ?? null);

  return (
    <div className="h-screen bg-bg text-primary flex flex-col">
      {/*HEADER*/}
      <div className="shrink-0 max-w-6xl mx-auto w-full px-6 py-10">
        <h1 className="text-heading text-center text-4xl font-semibold">
          iRacing Setup Comparison
        </h1>

        {view === "compare" && (
          <div className="flex gap-10 items-center justify-center mt-10">
            <button
              onClick={handleResetClick}
              className="
                px-4 py-2 rounded-md
                bg-red-600 text-white font-medium
                hover:bg-red-700 active:bg-redi-800
                transition
              "
            >
              Reupload
            </button>
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="relative flex items-center h-10 p-1 rounded-md bg-white/5 border border-theme w-55 overflow-hidden"
            >
              {/* Slider */}
              <div
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-md bg-green-600 transition-transform duration-200
                  ${showAll ? "translate-x-0" : "translate-x-full"}`}
              />

              {/* Labels */}
              <div className="relative z-10 flex w-full text-sm font-medium">
                <span
                  className={`w-1/2 text-center ${showAll ? "text-white" : "text-muted"}`}
                >
                  All Rows
                </span>
                <span
                  className={`w-1/2 text-center ${!showAll ? "text-white" : "text-muted"}`}
                >
                  Changes
                </span>
              </div>
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
              Swap Setups
            </button>
          </div>
        )}
      </div>

      {/*CONTENT*/}
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 items-center">
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
          <CompareView
            setupA={setupA!.setup}
            setupB={setupB!.setup}
            showAll={showAll}
          />
        )}
      </div>
    </div>
  );
}

export default App;
