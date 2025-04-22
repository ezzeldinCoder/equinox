export default {
    name: 'blog',
    title: 'Blog',
    type: 'document',
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Title of blog article',
        },
        {
            name: 'slug',
            type: 'slug',
            title: 'Slug of your blog article',
            options: {
                source: 'title',
                maxLength: 96,
            },
        },
        {
            name: 'titleImage',
            title: 'Title image',
            type: 'image',
        },
        {
            name: "smallDescription",
            type: "text",
            title: "Small description",
        },
        {
            name: "content",
            type: "array",
            title: "Content",
            of: [{type: "block"}],
        },
    ]
}