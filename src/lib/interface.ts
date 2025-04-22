import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface Blog {
    title: string;
    smallDescription: string;
    currentSlug: string;
    titleImage: SanityImageSource;
}

export interface fullBlog {
    currentSlug: string;
    title: string;
    content: unknown;
    titleImage: SanityImageSource;
}

