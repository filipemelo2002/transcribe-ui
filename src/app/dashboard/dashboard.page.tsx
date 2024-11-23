import { Skeleton } from "@/components/ui/skeleton";
import { SubtitleService } from "@/services/subtitle.service";
import { TranscribeAIService } from "@/services/transcribe-ai.service";
import { useDashboard } from "./dashboard.state";
import { CaptionsForm } from "@/components/captions-form/captions-form";
import { TranscribeForm } from "@/components/transcribe-form/transcribe-form";
import { MediaPreview } from "@/components/media-preview/media-preview";

const subtitleService = new SubtitleService();
const transcribeService = new TranscribeAIService();

export const Dashboard = () => {
  const {
    file,
    caption,
    showPreview,
    processing,
    onProcessFile,
    resetForm,
    inputElement,
    onChangeFile,
  } = useDashboard({
    transcribeService,
    subtitleService,
  });

  const containerMaxWidth =
    showPreview || processing ? "max-w-[1140px]" : "max-w-[450px]";

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground font-sans items-center justify-center">
      <div className={`flex flex-col w-full ${containerMaxWidth} gap-3 p-3`}>
        <div className="flex gap-3 lg:flex-nowrap md:flex-wrap-reverse items-center justify-center w-full">
          {showPreview && (
            <MediaPreview file={file as File} caption={caption} />
          )}
          {processing && <Skeleton className=" aspect-video w-full" />}
          <TranscribeForm
            file={file}
            inputElement={inputElement}
            onChangeFile={onChangeFile}
            onProcessFile={onProcessFile}
            processing={processing}
            resetForm={resetForm}
          />
        </div>
        {caption && <CaptionsForm />}
      </div>
    </div>
  );
};
