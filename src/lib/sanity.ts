import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
    projectId: "rnlmxizc",
    dataset: "production",
    apiVersion: "2023-05-03",
    useCdn: false,
});

export const imageBuilder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource | null) => {
    if (!source) {
        return ''; // Return empty string or a placeholder image URL
    }
    return imageBuilder.image(source).auto('format').fit('max').url();
}
