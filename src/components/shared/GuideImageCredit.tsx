import { GUIDE_IMAGE_CREDITS, type GuideImageId } from "@/lib/guideImageCredits";

export function GuideImageCredit({ image }: { image: GuideImageId }) {
  const credit = GUIDE_IMAGE_CREDITS[image];
  return (
    <span className="block break-words">
      <a href={credit.source} className="underline" rel="noreferrer">{credit.title}</a>
      {" by "}{credit.creator}{", "}
      <a href={credit.licenseUrl} className="underline" rel="license noreferrer">{credit.license}</a>
      {". Resized and cropped for display; this license applies to the image."}
    </span>
  );
}
