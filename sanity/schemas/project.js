// sanity/schemas/project.js
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'mode',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'UI Design', value: 'ui' },
          { title: 'UX Design', value: 'ux' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'type',
      title: 'Project Type',
      description: 'e.g. Dashboard, Mobile App, Video Game, Research',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Card Description',
      description: 'Short description shown on the project card',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required()
    },
    {
      name: 'externalUrl',
      title: 'External Link URL',
      description: 'Optional — if set, clicking this card opens this URL instead of a gallery',
      type: 'url',
    },
    {
      name: 'isStatic',
      title: 'Static Card (No Interaction)',
      description: 'If enabled, clicking this card does nothing — no gallery, no external link',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'blurb',
      title: 'Project Overview',
      description: 'Full written description shown when "Overview" is clicked in the gallery',
      type: 'text',
      rows: 5,
    },
    {
      name: 'role',
      title: 'Your Role',
      description: 'e.g. Lead UX Designer',
      type: 'string',
    },
    {
      name: 'duration',
      title: 'Duration',
      description: 'e.g. 3 months',
      type: 'string',
    },
    {
      name: 'platform',
      title: 'Platform',
      description: 'e.g. iOS & Android, Web App',
      type: 'string',
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      description: 'Main image shown on the project card',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'slides',
      title: 'Gallery Slides',
      description: 'Up to 5 images shown in the lightbox gallery when a project is clicked',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'slide',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: Rule => Rule.required()
            },
            {
              name: 'label',
              title: 'Slide Label',
              description: 'Short title shown on the image (e.g. "Overview Dashboard")',
              type: 'string'
            },
            {
              name: 'caption',
              title: 'Caption',
              description: 'Longer description revealed when "Show Caption" is clicked',
              type: 'text',
              rows: 2
            }
          ],
          preview: {
            select: { title: 'label', media: 'image' }
          }
        }
      ],
      validation: Rule => Rule.max(5)
    },
    {
      name: 'order',
      title: 'Display Order',
      description: 'Lower numbers appear first',
      type: 'number',
      initialValue: 10
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'mode',
      media: 'thumbnail'
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle === 'ui' ? '🎨 UI Design' : '🔍 UX Design',
        media
      }
    }
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
}
