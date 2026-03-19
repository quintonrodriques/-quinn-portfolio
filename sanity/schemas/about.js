// sanity/schemas/about.js
export default {
  name: 'about',
  title: 'About / Bio',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'bio',
      title: 'Bio (Paragraph 1)',
      type: 'text',
      rows: 4
    },
    {
      name: 'bio2',
      title: 'Bio (Paragraph 2)',
      type: 'text',
      rows: 2
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      initialValue: 'Montreal'
    },
    {
      name: 'availability',
      title: 'Availability Tag',
      description: 'e.g. "Available for Projects — 2026"',
      type: 'string'
    },
    {
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Skill Name', type: 'string' },
            { name: 'years', title: 'Years (e.g. "10 yrs")', type: 'string' }
          ],
          preview: {
            select: { title: 'name', subtitle: 'years' }
          }
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return { title: 'About & Bio' }
    }
  }
}
