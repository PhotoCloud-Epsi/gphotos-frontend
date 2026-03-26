export type PhotosResponse = {
  query: string
  count: number
  message: string
  photos: {
    id: number
    url: string
    tags: string
    created_at: string
  }[]
}

export type TagsResponse = {
  count: number
  message: string
  tags: string[]
}