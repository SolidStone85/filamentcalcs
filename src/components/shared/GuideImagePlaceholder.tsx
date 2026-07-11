import Image from "next/image";

type Props = {
  /** Identifier used to derive the public path: /guides/<guide-slug>/<slot>.* */
  slot: string;
  /** Alt text for the image (used as a description until the image is added). */
  alt: string;
  /**
   * Generation prompt. Kept on the placeholder so the prompt is in code with
   * the article and easy to regenerate. Not rendered when an image exists.
   */
  prompt: string;
  /** Optional explicit image src override. */
  src?: string;
};

/**
 * Renders an Image when `src` is provided, otherwise nothing (readers never
 * see an unfinished placeholder). To wire up a real image:
 *   1. Save the image to `public/guides/<guide-slug>/<slot>.png` (or .jpg/.webp)
 *   2. Pass `src="/guides/<guide-slug>/<slot>.png"` to the component
 */
export function GuideImagePlaceholder({ slot, alt, prompt, src }: Props) {
  if (src) {
    return (
      <figure className="my-8">
        <div className="overflow-hidden rounded-xl border border-border">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={675}
            className="h-auto w-full"
          />
        </div>
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {alt}
        </figcaption>
      </figure>
    );
  }

  // No image yet: render nothing. The prompt stays in code (props above) so
  // the image can be generated later, but readers never see an unfinished
  // dashed box with an internal generation prompt.
  void slot;
  void prompt;
  return null;
}
