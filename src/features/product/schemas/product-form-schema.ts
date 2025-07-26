import z from 'zod'
import { PRODUCT_STATUS_LIST } from '../lib/constants'

const MAX_FILE_SIZE = 1024 * 1024 // 1MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']

export const productFormSchema = z.object({
  status: z.enum(PRODUCT_STATUS_LIST),
  title: z.string().min(1, {
    message: 'Please provide a valid title.',
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  media: z.array(
    z.object({
      uuid: z.string(),
      id: z.string().optional(),
      name: z.string(),
      type: z.string(),
      url: z.string(),
      rank: z.number(),
      file: z
        .instanceof(File)
        .refine(
          (file) =>
            ALLOWED_IMAGE_TYPES.includes(file.type) ||
            ALLOWED_VIDEO_TYPES.includes(file.type),
          {
            message:
              'The file must be an image (JPG, PNG, WEBP) or a video (MP4, WEBM)',
          },
        )
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: 'The file must not be larger than 1MB',
        })
        .optional(),
    }),
  ),
  options: z.array(
    z.object({
      uuid: z.string(),
      id: z.string().optional(),
      name: z.string(),
      values: z.array(z.string()),
    }),
  ),
  variants: z.array(
    z.object({
      uuid: z.string(),
      id: z.string().optional(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      options: z.array(
        z.object({
          value: z.string(),
        }),
      ),
    }),
  ),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
      parentId: z.string().nullable(),
    })
    .nullable()
    .optional(),
  type: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  vendor: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  collections: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .optional(),
})

export type ProductFormSchema = z.infer<typeof productFormSchema>
