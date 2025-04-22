import { Container } from "@/components/container";
import { client, urlFor } from "@/lib/sanity";
import type { Blog } from "@/lib/interface";
import { Card, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// Disable caching to always fetch fresh data
export const revalidate = 0;

async function getData() {
    const query = `
    *[_type == 'blog'] | order(_createdAt desc) {
      title,
        smallDescription,
        "currentSlug": slug.current,
        titleImage
    }`;
  
    const data = await client.fetch(query);
  
    return data;
  }

export default async function BlogPage() {
    const data: Blog[] = await getData();

    return (
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((post) => (
                <Card key={post.currentSlug}>
                    {post.titleImage && (
                        <div className="w-full h-[200px] relative">
                            <Image 
                                src={urlFor(post.titleImage)} 
                                alt={post.title} 
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                                className="rounded-t-lg"
                            />
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold line-clamp-2">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-3 text-xs text-muted-foreground">{post.smallDescription}</CardDescription>
                        <div className="flex w-full">
                            <Button className="w-full mt-9" asChild>
                                <Link href={`/blog/${post.currentSlug}`}>Read More</Link>
                            </Button>
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </Container>
    )
}
