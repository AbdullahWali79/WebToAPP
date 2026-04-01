import type { BuildStatus } from "@/lib/types";

const steps = ["queued", "processing", "success"] as const;

export function ProgressStepper({
  status
}: {
  status: BuildStatus;
}): JSX.Element {
  return (
    <ol className="stepper">
      {steps.map((step, index) => {
        const active =
          status === step ||
          (status === "processing" && step === "queued") ||
          (status === "success" && (step === "queued" || step === "processing"));
        const failed = status === "failed" && step === "success";
        return (
          <li
            key={step}
            className={`stepper-item ${active ? "active" : ""} ${
              failed ? "failed" : ""
            }`}
          >
            <span className="step-index">{index + 1}</span>
            <span className="step-label">
              {step === "queued" && "Queued"}
              {step === "processing" && "Processing"}
              {step === "success" && "Completed"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
