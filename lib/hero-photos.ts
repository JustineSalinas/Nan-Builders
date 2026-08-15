/**
 * Photographs behind the interior page heroes.
 *
 * Same treatment as the home hero: the picture is atmosphere under a navy
 * scrim, never a claim about the page it sits on. Pages we have no honest
 * photograph for keep the drawn backdrop instead — About sat on a render for
 * one round and was rightly cut, since a render can't stand in for who we are.
 *
 * `position` is the object-position. It matters more here than on the home
 * hero: this band is short and wide, so a 16:9 frame gets cropped hard, and
 * centred is rarely where the subject is.
 */
export type HeroPhoto = {
  src: string;
  blurDataURL: string;
  position: string;
};

export const heroPhotos = {
  services: {
    src: "/hero/construction-site-dusk.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADwAQCdASoQAAkABUB8JbACdAEPcsu4v0AA/Nj/nCfZ5ncr3NhDCWREIe5JpXwVYZrj9IhcKWwAAA==",
    // Lower and further left than the home hero's crop of the same photo, so
    // the two bands don't read as the same picture twice — this one sits on
    // the deck and the formwork rather than on the skyline.
    position: "38% 72%",
  },
} as const satisfies Record<string, HeroPhoto>;
