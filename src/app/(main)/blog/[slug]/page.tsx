import { Container } from "@/components/container";
import type { fullBlog } from "@/lib/interface";
import { client, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";

export const revalidate = 30; // revalidate at most 30 seconds

async function getData(slug: string) {
  const query = `
    *[_type == "blog" && slug.current == '${slug}'] {
        "currentSlug": slug.current,
          title,
          content,
          titleImage
      }[0]`;

  const data = await client.fetch(query);
  return data;
}

export default async function BlogArticle({
  params,
}: {
  params: { slug: string };
}) {
  const data: fullBlog = await getData(params.slug);

  return (
    <Container className="max-w-7xl mx-auto px-8 flex flex-col items-center justify-center">
      <h1>
        <span className="block text-base text-center text-primary font-semibold tracking-wide uppercase">
          Equinox - Blog
        </span>
        <span className="mt-2 block text-3xl text-center leading-8 font-bold tracking-tight sm:text-4xl">
          {data.title}
        </span>
      </h1>

      <Image
        src={urlFor(data.titleImage)}
        width={800}
        height={800}
        alt="Title Image"
        priority
        className="rounded-lg mt-8 border"
      />

      <div className="mt-16 prose prose-blue prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
        <PortableText value={data.content as PortableTextBlock[]} />
      </div>
    </Container>
  );
}
