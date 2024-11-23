export interface MediaPreviewProps {
  file: File;
  caption: Blob | null;
}

export const MediaPreview = ({ file, caption }: MediaPreviewProps) => {
  return (
    <div className="aspect-video w-full">
      <video id="video" controls preload="metadata" className="w-full h-full">
        <source src={URL.createObjectURL(file as File)} type="video/mp4" />
        {caption && (
          <track
            kind="subtitles"
            label="English"
            srcLang="en"
            default
            src={URL.createObjectURL(caption)}
          />
        )}
      </video>
    </div>
  );
};
